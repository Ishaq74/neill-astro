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
    return await DatabaseUtil.withDatabase('services.sqlite', (db) => {
      const services = db.prepare('SELECT * FROM services ORDER BY sort_order').all();
      return new Response(JSON.stringify(services), {
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
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await request.json();
    const db = new Database('./data/services.sqlite');
    
    const stmt = db.prepare(`
      INSERT INTO services (slug, title, description, icon_name, image_path, features, price, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      data.slug,
      data.title,
      data.description,
      data.icon_name,
      data.image_path,
      JSON.stringify(data.features),
      data.price,
      data.sort_order
    );
    
    db.close();

    return new Response(JSON.stringify({ id: result.lastInsertRowid, ...data }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
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
    const db = new Database('./data/services.sqlite');
    
    const stmt = db.prepare(`
      UPDATE services 
      SET slug = ?, title = ?, description = ?, icon_name = ?, image_path = ?, features = ?, price = ?, sort_order = ?
      WHERE id = ?
    `);
    
    stmt.run(
      data.slug,
      data.title,
      data.description,
      data.icon_name,
      data.image_path,
      JSON.stringify(data.features),
      data.price,
      data.sort_order,
      data.id
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

    const db = new Database('./data/services.sqlite');
    const stmt = db.prepare('DELETE FROM services WHERE id = ?');
    stmt.run(id);
    db.close();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erreur lors de la suppression' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};