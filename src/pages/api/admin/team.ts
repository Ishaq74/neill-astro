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
    return await DatabaseUtil.withDatabase('team', async (db) => {
      const team = await db.prepare('SELECT * FROM team_members ORDER BY sort_order').all();
      return new Response(JSON.stringify(team), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  } catch (error) {
    console.error("Error fetching team:", error);
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
    return await DatabaseUtil.withDatabase('team');
    
    const stmt = db.prepare(`
      INSERT INTO team_members (slug, name, role, speciality, image_path, experience, description, certifications, achievements, social_instagram, social_linkedin, social_email, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = await stmt.run(
      data.slug,
      data.name,
      data.role,
      data.speciality,
      data.image_path,
      data.experience,
      data.description,
      data.certifications,
      data.achievements,
      data.social_instagram,
      data.social_linkedin,
      data.social_email,
      data.sort_order
    );
    
    

    return new Response(JSON.stringify({ id: result.lastInsertRowid, ...data }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la création', details: process.env.NODE_ENV === 'development' ? error.message : undefined }), {
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
    return await DatabaseUtil.withDatabase('team');
    
    const stmt = db.prepare(`
      UPDATE team_members 
      SET slug = ?, name = ?, role = ?, speciality = ?, image_path = ?, experience = ?, description = ?, certifications = ?, achievements = ?, social_instagram = ?, social_linkedin = ?, social_email = ?, sort_order = ?
      WHERE id = ?
    `);
    
    await stmt.run(
      data.slug,
      data.name,
      data.role,
      data.speciality,
      data.image_path,
      data.experience,
      data.description,
      data.certifications,
      data.achievements,
      data.social_instagram,
      data.social_linkedin,
      data.social_email,
      data.sort_order,
      data.id
    );
    
    

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la mise à jour', details: process.env.NODE_ENV === 'development' ? error.message : undefined }), {
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

    return await DatabaseUtil.withDatabase('team');
    const stmt = db.prepare('DELETE FROM team_members WHERE id = ?');
    await stmt.run(id);
    

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: 'Erreur lors de la suppression', details: process.env.NODE_ENV === 'development' ? error.message : undefined }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};