import type { APIRoute } from 'astro';
import Database from 'better-sqlite3';

const db = new Database('./data/gallery.sqlite');

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const searchParams = new URLSearchParams(url.search);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    let query = 'SELECT * FROM gallery';
    let params: any[] = [];

    const conditions = [];
    if (category && category !== 'all') {
      conditions.push('category = ?');
      params.push(category);
    }
    if (featured === 'true') {
      conditions.push('is_featured = 1');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY sort_order ASC, created_at DESC';

    const stmt = db.prepare(query);
    const items = stmt.all(...params);

    return new Response(JSON.stringify({
      success: true,
      data: items.map(item => ({
        ...item,
        images: item.images ? JSON.parse(item.images) : [],
        is_featured: Boolean(item.is_featured)
      }))
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch gallery items'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const {
      slug,
      title,
      description,
      category,
      service_id,
      images,
      featured_image,
      is_featured,
      sort_order
    } = data;

    // Validate required fields
    if (!slug || !title || !category || !featured_image) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stmt = db.prepare(`
      INSERT INTO gallery (
        slug, title, description, category, service_id, images,
        featured_image, is_featured, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      slug,
      title,
      description || '',
      category,
      service_id || null,
      JSON.stringify(images || [featured_image]),
      featured_image,
      is_featured ? 1 : 0,
      sort_order || 0
    );

    return new Response(JSON.stringify({
      success: true,
      data: { id: result.lastInsertRowid, ...data }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error && error.message.includes('UNIQUE constraint failed') 
        ? 'A gallery item with this slug already exists'
        : 'Failed to create gallery item'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const {
      id,
      slug,
      title,
      description,
      category,
      service_id,
      images,
      featured_image,
      is_featured,
      sort_order
    } = data;

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Gallery item ID is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stmt = db.prepare(`
      UPDATE gallery SET
        slug = ?, title = ?, description = ?, category = ?, service_id = ?,
        images = ?, featured_image = ?, is_featured = ?, sort_order = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = stmt.run(
      slug,
      title,
      description || '',
      category,
      service_id || null,
      JSON.stringify(images || [featured_image]),
      featured_image,
      is_featured ? 1 : 0,
      sort_order || 0,
      id
    );

    if (result.changes === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Gallery item not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: { id, ...data }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to update gallery item'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request, url }) => {
  try {
    const searchParams = new URLSearchParams(url.search);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Gallery item ID is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stmt = db.prepare('DELETE FROM gallery WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Gallery item not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Gallery item deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to delete gallery item'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

process.on('exit', () => {
  db.close();
});