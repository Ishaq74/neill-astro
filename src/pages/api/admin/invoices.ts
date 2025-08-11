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
    const db = new Database('./data/reservations.sqlite');
    
    const invoices = db.prepare(`
      SELECT i.*, r.name as customer_name, r.email as customer_email, r.service_name 
      FROM invoices i
      LEFT JOIN reservations r ON i.reservation_id = r.id
      ORDER BY i.created_at DESC
    `).all();
    
    db.close();

    return new Response(JSON.stringify(invoices), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await request.json();
    const { 
      reservation_id, 
      customer_name, 
      customer_email, 
      service_name, 
      amount, 
      due_date,
      notes 
    } = data;

    if (!customer_name || !customer_email || !service_name || !amount) {
      return new Response(JSON.stringify({ error: 'Informations client et service requises' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate invoice number
    const now = new Date();
    const invoiceNumber = `INV-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Date.now().toString().slice(-6)}`;

    const db = new Database('./data/reservations.sqlite');
    
    const stmt = db.prepare(`
      INSERT INTO invoices (
        reservation_id, invoice_number, customer_name, customer_email, 
        service_name, amount, due_date, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      reservation_id || null,
      invoiceNumber,
      customer_name,
      customer_email,
      service_name,
      amount,
      due_date || null,
      notes || null
    );
    
    const newInvoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(result.lastInsertRowid);
    db.close();

    return new Response(JSON.stringify(newInvoice), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur lors de la création de la facture:', error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la création' }), {
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
    const { id, status, paid_amount, payment_method, payment_intent_id, notes } = data;

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID de facture requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = new Database('./data/reservations.sqlite');
    
    // Get current invoice data
    const currentInvoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(id);
    if (!currentInvoice) {
      db.close();
      return new Response(JSON.stringify({ error: 'Facture non trouvée' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update status based on payment amount
    let finalStatus = status;
    if (paid_amount !== undefined) {
      const totalAmount = parseFloat(currentInvoice.amount);
      const paidAmount = parseFloat(paid_amount);
      
      if (paidAmount >= totalAmount) {
        finalStatus = 'paid';
      } else if (paidAmount > 0) {
        finalStatus = 'partially_paid';
      } else {
        finalStatus = 'pending';
      }
    }

    const stmt = db.prepare(`
      UPDATE invoices 
      SET status = ?, paid_amount = ?, payment_method = ?, payment_intent_id = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(
      finalStatus || currentInvoice.status,
      paid_amount !== undefined ? paid_amount : currentInvoice.paid_amount,
      payment_method || currentInvoice.payment_method,
      payment_intent_id || currentInvoice.payment_intent_id,
      notes !== undefined ? notes : currentInvoice.notes,
      id
    );
    
    const updatedInvoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(id);
    db.close();

    return new Response(JSON.stringify(updatedInvoice), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la facture:', error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la mise à jour' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = new Database('./data/reservations.sqlite');
    const stmt = db.prepare('DELETE FROM invoices WHERE id = ?');
    const result = stmt.run(id);
    db.close();
    
    if (result.changes === 0) {
      return new Response(JSON.stringify({ error: 'Facture non trouvée' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Facture supprimée' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la facture:', error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la suppression' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};