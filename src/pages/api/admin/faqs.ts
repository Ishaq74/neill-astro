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
    return await DatabaseUtil.withDatabase('faqs.sqlite', (db) => {
      const faqs = db.prepare('SELECT * FROM faqs WHERE is_active = 1 ORDER BY sort_order, id').all();
      return new Response(JSON.stringify(faqs), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return new Response(JSON.stringify({ 
      error: 'Erreur serveur', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }), {
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
    
    return await DatabaseUtil.withDatabase('faqs.sqlite', (db) => {
      const stmt = db.prepare(`
        INSERT INTO faqs (question, answer, category, sort_order, is_active)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        data.question,
        data.answer,
        data.category || 'general',
        data.sort_order || 0,
        data.is_active !== undefined ? data.is_active : 1
      );

      return new Response(JSON.stringify({ id: result.lastInsertRowid, ...data }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return new Response(JSON.stringify({ 
      error: 'Erreur lors de la création', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }), {
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
    
    return await DatabaseUtil.withDatabase('faqs.sqlite', (db) => {
      const stmt = db.prepare(`
        UPDATE faqs 
        SET question = ?, answer = ?, category = ?, sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      
      stmt.run(
        data.question,
        data.answer,
        data.category,
        data.sort_order,
        data.is_active,
        data.id
      );

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return new Response(JSON.stringify({ 
      error: 'Erreur lors de la mise à jour', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }), {
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

    return await DatabaseUtil.withDatabase('faqs.sqlite', (db) => {
      const stmt = db.prepare('DELETE FROM faqs WHERE id = ?');
      stmt.run(id);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return new Response(JSON.stringify({ 
      error: 'Erreur lors de la suppression', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};