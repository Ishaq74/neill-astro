import type { APIRoute } from 'astro';
import { DatabaseUtil } from '../../../lib/database';

export const prerender = false;

// Authentication check helper
function isAuthenticated(request: Request): boolean {
  const cookie = request.headers.get('cookie');
  return cookie?.includes('admin-session=authenticated') ?? false;
}

export const GET: APIRoute = async ({ request }) => {
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const db = new Database('./data/site_settings.sqlite');
    const settings = db.prepare('SELECT * FROM site_settings WHERE id = 1').get();
    db.close();

    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await request.json();
    const db = new Database('./data/site_settings.sqlite');
    
    const stmt = db.prepare(`
      UPDATE site_settings 
      SET site_name = ?, site_description = ?, contact_email = ?, contact_phone = ?, contact_address = ?,
          social_instagram = ?, social_facebook = ?, social_tiktok = ?, business_hours = ?,
          smtp_host = ?, smtp_port = ?, smtp_username = ?, smtp_password = ?, smtp_secure = ?, smtp_from_name = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `);
    
    stmt.run(
      data.site_name,
      data.site_description,
      data.contact_email,
      data.contact_phone,
      data.contact_address,
      data.social_instagram,
      data.social_facebook,
      data.social_tiktok,
      data.business_hours,
      data.smtp_host,
      data.smtp_port,
      data.smtp_username,
      data.smtp_password,
      data.smtp_secure,
      data.smtp_from_name
    );
    
    db.close();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erreur lors de la mise à jour' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};