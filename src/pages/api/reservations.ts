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

    // Validate date and time if provided
    if (data.preferred_date && data.preferred_time) {
      const db = new Database('./data/reservations.sqlite');
      
      // Check if the time slot is available
      const slotCheck = db.prepare(`
        SELECT * FROM time_slots 
        WHERE date = ? AND start_time = ? AND is_available = 1
      `).get(data.preferred_date, data.preferred_time);
      
      if (!slotCheck) {
        db.close();
        return new Response(JSON.stringify({ 
          error: 'Ce créneau n\'est pas disponible' 
        }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Check if there's already a reservation at this time
      const conflictCheck = db.prepare(`
        SELECT * FROM reservations 
        WHERE preferred_date = ? AND preferred_time = ? AND status != 'cancelled'
      `).get(data.preferred_date, data.preferred_time);
      
      if (conflictCheck) {
        db.close();
        return new Response(JSON.stringify({ 
          error: 'Ce créneau est déjà réservé' 
        }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Create the reservation
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
        data.preferred_date,
        data.preferred_time,
        data.message || '',
        'pending'
      );
      
      // Mark the time slot as reserved
      db.prepare(`
        UPDATE time_slots 
        SET is_available = 0, reserved_by = ?, updated_at = CURRENT_TIMESTAMP
        WHERE date = ? AND start_time = ?
      `).run(result.lastInsertRowid, data.preferred_date, data.preferred_time);
      
      db.close();

      return new Response(JSON.stringify({ 
        success: true, 
        id: result.lastInsertRowid,
        message: 'Réservation créée avec succès' 
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Create reservation without specific time (will be scheduled later)
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
    }
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