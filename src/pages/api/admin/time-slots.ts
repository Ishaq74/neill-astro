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
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    const db = new Database('./data/reservations.sqlite');
    
    let query = 'SELECT * FROM time_slots ORDER BY date, start_time';
    let params = [];
    
    if (date) {
      query = 'SELECT * FROM time_slots WHERE date = ? ORDER BY start_time';
      params = [date];
    }
    
    const slots = db.prepare(query).all(...params);
    db.close();

    return new Response(JSON.stringify(slots), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux:', error);
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
    const { date, start_time, end_time, service_type, notes } = data;

    if (!date || !start_time || !end_time) {
      return new Response(JSON.stringify({ error: 'Date, heure de début et de fin requises' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = new Database('./data/reservations.sqlite');
    
    const stmt = db.prepare(`
      INSERT INTO time_slots (date, start_time, end_time, service_type, notes, is_available)
      VALUES (?, ?, ?, ?, ?, 1)
    `);
    
    const result = stmt.run(date, start_time, end_time, service_type || null, notes || null);
    
    const newSlot = db.prepare('SELECT * FROM time_slots WHERE id = ?').get(result.lastInsertRowid);
    db.close();

    return new Response(JSON.stringify(newSlot), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur lors de la création du créneau:', error);
    
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return new Response(JSON.stringify({ error: 'Un créneau existe déjà pour cette date et heure' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
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
    const { id, is_available, service_type, notes, reserved_by } = data;

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID du créneau requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = new Database('./data/reservations.sqlite');
    
    const stmt = db.prepare(`
      UPDATE time_slots 
      SET is_available = ?, service_type = ?, notes = ?, reserved_by = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    const result = stmt.run(
      is_available !== undefined ? is_available : 1,
      service_type || null,
      notes || null,
      reserved_by || null,
      id
    );
    
    if (result.changes === 0) {
      db.close();
      return new Response(JSON.stringify({ error: 'Créneau non trouvé' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const updatedSlot = db.prepare('SELECT * FROM time_slots WHERE id = ?').get(id);
    db.close();

    return new Response(JSON.stringify(updatedSlot), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du créneau:', error);
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
    const stmt = db.prepare('DELETE FROM time_slots WHERE id = ?');
    const result = stmt.run(id);
    db.close();
    
    if (result.changes === 0) {
      return new Response(JSON.stringify({ error: 'Créneau non trouvé' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Créneau supprimé' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du créneau:', error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la suppression' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};