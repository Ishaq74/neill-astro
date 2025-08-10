import type { APIRoute } from 'astro';
import Database from 'better-sqlite3';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { password } = await request.json();
    
    // Simple password check - in production, this should be more secure
    if (password === 'admin123') {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'admin-session=authenticated; HttpOnly; Path=/; Max-Age=3600'
        }
      });
    } else {
      return new Response(JSON.stringify({ success: false, message: 'Mot de passe incorrect' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'admin-session=; HttpOnly; Path=/; Max-Age=0'
    }
  });
};