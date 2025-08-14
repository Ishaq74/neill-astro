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
    return await DatabaseUtil.withDatabase('reservations', async (db) => {
      const reservations = await db.prepare('SELECT * FROM reservations ORDER BY created_at DESC').all();
      return new Response(JSON.stringify(reservations), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    return await DatabaseUtil.withDatabase('reservations', async (db) => {
      const stmt = db.prepare(`
        INSERT INTO reservations (name, email, phone, service_type, service_name, preferred_date, preferred_time, message, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = await stmt.run(
        data.name,
        data.email,
        data.phone,
        data.service_type,
        data.service_name,
        data.preferred_date,
        data.preferred_time,
        data.message,
        data.status || 'pending'
      );

      return new Response(JSON.stringify({ id: result.lastInsertRowid, ...data }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  } catch (error) {
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
    
    return await DatabaseUtil.withDatabase('reservations', async (db) => {
      const stmt = db.prepare(`
        UPDATE reservations 
        SET name = ?, email = ?, phone = ?, service_type = ?, service_name = ?, preferred_date = ?, preferred_time = ?, message = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      
      await stmt.run(
        data.name,
        data.email,
        data.phone,
        data.service_type,
        data.service_name,
        data.preferred_date,
        data.preferred_time,
        data.message,
        data.status,
        data.id
      );

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  } catch (error) {
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

    return await DatabaseUtil.withDatabase('reservations', async (db) => {
      const stmt = db.prepare('DELETE FROM reservations WHERE id = ?');
      await stmt.run(id);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erreur lors de la suppression' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};