import type { APIRoute } from 'astro';
import { DatabaseUtil } from '../../lib/database';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const service_type = searchParams.get('service_type');

    if (!date) {
      return new Response(JSON.stringify({ 
        error: 'Date requise' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = DatabaseUtil.getDatabase('reservations.sqlite');
    
    // Get available time slots for the specified date
    let query = `
      SELECT * FROM time_slots 
      WHERE date = ? AND is_available = 1
    `;
    let params = [date];
    
    // Optionally filter by service type if specified
    if (service_type) {
      query += ` AND (service_type IS NULL OR service_type = ?)`;
      params.push(service_type);
    }
    
    query += ` ORDER BY start_time`;
    
    const availableSlots = db.prepare(query).all(...params);
    
    // Also check for any existing reservations on this date to double-check availability
    const existingReservations = db.prepare(`
      SELECT preferred_time FROM reservations 
      WHERE preferred_date = ? AND status != 'cancelled'
    `).all(date);
    
    const bookedTimes = new Set(existingReservations.map(r => r.preferred_time));
    
    // Filter out slots that are booked
    const trulyAvailable = availableSlots.filter(slot => !bookedTimes.has(slot.start_time));
    
    

    return new Response(JSON.stringify(trulyAvailable), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux disponibles:', error);
    return new Response(JSON.stringify({ 
      error: 'Erreur lors de la récupération des créneaux' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};