import type { APIRoute } from 'astro';
import Database from 'better-sqlite3';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.service_type) {
      return new Response(JSON.stringify({ 
        error: 'Nom, email et type de service sont requis' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = new Database('./data/reservations.sqlite');
    
    const stmt = db.prepare(`
      INSERT INTO reservations (name, email, phone, service_type, service_name, preferred_date, preferred_time, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      data.name,
      data.email,
      data.phone || '',
      data.service_type,
      data.service_name || '',
      data.preferred_date || '',
      data.preferred_time || '',
      data.message || '',
      'pending'
    );
    
    db.close();

    return new Response(JSON.stringify({ 
      success: true, 
      id: result.lastInsertRowid,
      message: 'Réservation créée avec succès' 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur lors de la création de réservation:', error);
    return new Response(JSON.stringify({ 
      error: 'Erreur lors de la création de la réservation' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};