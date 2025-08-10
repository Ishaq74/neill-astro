import type { APIRoute } from 'astro';
import Database from 'better-sqlite3';

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
    const category = searchParams.get('category');
    
    const db = new Database('./data/reservations.sqlite');
    let query = 'SELECT * FROM parameters ORDER BY category, key';
    let params = [];
    
    if (category) {
      query = 'SELECT * FROM parameters WHERE category = ? ORDER BY key';
      params = [category];
    }
    
    const settings = db.prepare(query).all(...params);
    db.close();

    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
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
    const { key, value } = data;

    if (!key) {
      return new Response(JSON.stringify({ error: 'Clé de paramètre requise' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = new Database('./data/reservations.sqlite');
    
    const stmt = db.prepare(`
      UPDATE parameters 
      SET value = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE key = ?
    `);
    
    const result = stmt.run(value, key);
    
    if (result.changes === 0) {
      db.close();
      return new Response(JSON.stringify({ error: 'Paramètre non trouvé' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    db.close();

    return new Response(JSON.stringify({ key, value, message: 'Paramètre mis à jour avec succès' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paramètre:', error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la mise à jour' }), {
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
    const { key, value, description, category } = data;

    if (!key || !category) {
      return new Response(JSON.stringify({ error: 'Clé et catégorie requises' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = new Database('./data/reservations.sqlite');
    
    const stmt = db.prepare(`
      INSERT INTO parameters (key, value, description, category)
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(key, value || '', description || '', category);
    db.close();

    return new Response(JSON.stringify({ 
      id: result.lastInsertRowid,
      key, 
      value, 
      description, 
      category,
      message: 'Paramètre créé avec succès' 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur lors de la création du paramètre:', error);
    
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return new Response(JSON.stringify({ error: 'Cette clé existe déjà' }), {
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