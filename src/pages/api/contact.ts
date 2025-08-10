import type { APIRoute } from 'astro';
import Database from 'better-sqlite3';
import nodemailer from 'nodemailer';

export const prerender = false;

interface SMTPConfig {
  smtp_host?: string;
  smtp_port?: number;
  smtp_username?: string;
  smtp_password?: string;
  smtp_secure?: boolean;
  smtp_from_name?: string;
  contact_email?: string;
}

async function sendEmailNotification(contactData: any, smtpConfig: SMTPConfig) {
  if (!smtpConfig.smtp_host || !smtpConfig.smtp_username || !smtpConfig.smtp_password || !smtpConfig.contact_email) {
    console.log('SMTP not configured, skipping email notification');
    return { success: false, error: 'SMTP not configured' };
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: smtpConfig.smtp_host,
      port: smtpConfig.smtp_port || 587,
      secure: smtpConfig.smtp_secure || false,
      auth: {
        user: smtpConfig.smtp_username,
        pass: smtpConfig.smtp_password,
      },
    });

    // Email to admin
    const adminMailOptions = {
      from: `"${smtpConfig.smtp_from_name || 'Neill Beauty Contact'}" <${smtpConfig.smtp_username}>`,
      to: smtpConfig.contact_email,
      subject: `Nouveau message de contact - ${contactData.subject || 'Contact'}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        ${contactData.phone ? `<p><strong>Téléphone:</strong> ${contactData.phone}</p>` : ''}
        ${contactData.subject ? `<p><strong>Sujet:</strong> ${contactData.subject}</p>` : ''}
        <p><strong>Message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${contactData.message.replace(/\n/g, '<br>')}
        </div>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          Message reçu le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
        </p>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    // Confirmation email to user
    const userMailOptions = {
      from: `"${smtpConfig.smtp_from_name || 'Neill Beauty'}" <${smtpConfig.smtp_username}>`,
      to: contactData.email,
      subject: 'Confirmation - Votre message a été reçu',
      html: `
        <h2>Merci pour votre message !</h2>
        <p>Bonjour ${contactData.name},</p>
        <p>Nous avons bien reçu votre message et vous remercions de nous avoir contactés.</p>
        <p>Nous vous répondrons dans les plus brefs délais, généralement sous 24h.</p>
        
        <h3>Récapitulatif de votre message :</h3>
        ${contactData.subject ? `<p><strong>Sujet:</strong> ${contactData.subject}</p>` : ''}
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${contactData.message.replace(/\n/g, '<br>')}
        </div>
        
        <hr style="margin: 20px 0;">
        <p>À bientôt,<br>L'équipe Neill Beauty</p>
        <p style="color: #666; font-size: 12px;">
          Ceci est un message automatique, merci de ne pas y répondre directement.
        </p>
      `,
    };

    await transporter.sendMail(userMailOptions);

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return new Response(JSON.stringify({ 
        error: 'Nom, email et message sont requis' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(JSON.stringify({ 
        error: 'Format d\'email invalide' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Save to database
    const contactDb = new Database('./data/contact.sqlite');
    
    const stmt = contactDb.prepare(`
      INSERT INTO contact_messages (name, email, phone, subject, message, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      data.name,
      data.email,
      data.phone || null,
      data.subject || null,
      data.message,
      'new'
    );
    
    contactDb.close();

    // Get SMTP configuration
    const settingsDb = new Database('./data/site_settings.sqlite');
    const smtpConfig = settingsDb.prepare(`
      SELECT smtp_host, smtp_port, smtp_username, smtp_password, smtp_secure, smtp_from_name, contact_email
      FROM site_settings 
      WHERE id = 1
    `).get() as SMTPConfig || {};
    settingsDb.close();

    // Send email notification
    const emailResult = await sendEmailNotification(data, smtpConfig);
    
    if (emailResult.success) {
      return new Response(JSON.stringify({ 
        success: true, 
        id: result.lastInsertRowid,
        message: 'Message envoyé avec succès' 
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Message saved but email failed
      return new Response(JSON.stringify({ 
        success: true, 
        id: result.lastInsertRowid,
        message: 'Message sauvegardé mais l\'envoi d\'email a échoué. Veuillez configurer SMTP.',
        emailError: emailResult.error
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Erreur lors du traitement du message de contact:', error);
    return new Response(JSON.stringify({ 
      error: 'Erreur lors de l\'envoi du message' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};