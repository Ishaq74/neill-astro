import type { APIRoute } from 'astro';
import { DatabaseUtil } from '../../../lib/database';

export const prerender = false;

// GET - List contact messages
export const GET: APIRoute = async ({ url }) => {
  try {
    return await DatabaseUtil.withDatabase('contact', async (db) => {
      const searchParams = url.searchParams;
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const status = searchParams.get('status');
      const search = searchParams.get('search');
      
      const offset = (page - 1) * limit;
      
      let query = `
        SELECT id, name, email, phone, subject, message, status, created_at, updated_at
        FROM contact_messages
      `;
      let countQuery = `SELECT COUNT(*) as total FROM contact_messages`;
      const params: any[] = [];
      const countParams: any[] = [];
      
      let whereClause = '';
      
      if (status) {
        whereClause += ' WHERE status = ?';
        params.push(status);
        countParams.push(status);
      }
      
      if (search) {
        const searchClause = (whereClause ? ' AND' : ' WHERE') + ' (name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)';
        whereClause += searchClause;
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }
      
      query += whereClause + ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      countQuery += whereClause;
      
      params.push(limit, offset);
      
      const messages = await db.prepare(query).all(params);
      const totalResult = await db.prepare(countQuery).get(countParams) as { total: number };
      
      return new Response(JSON.stringify({
        success: true,
        messages,
        pagination: {
          page,
          limit,
          total: totalResult.total,
          totalPages: Math.ceil(totalResult.total / limit)
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return new Response(JSON.stringify({ 
      error: 'Erreur lors de la récupération des messages' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// PUT - Update message status or add reply
export const PUT: APIRoute = async ({ request, params }) => {
  try {
    const data = await request.json();
    
    return await DatabaseUtil.withDatabase('contact', async (db) => {
      if (data.status) {
        // Update status
        const stmt = db.prepare(`
          UPDATE contact_messages 
          SET status = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
        
        const result = await stmt.run(data.status, data.id);
        
        if (result.changes === 0) {
          return new Response(JSON.stringify({ 
            error: 'Message non trouvé' 
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      if (data.reply) {
        // Add reply
        const stmt = db.prepare(`
          UPDATE contact_messages 
          SET admin_reply = ?, replied_at = CURRENT_TIMESTAMP, replied_by = ?, status = 'replied', updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
        
        const result = await stmt.run(data.reply, data.repliedBy || 'Admin', data.id);
        
        if (result.changes === 0) {
          return new Response(JSON.stringify({ 
            error: 'Message non trouvé' 
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Message mis à jour avec succès' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  } catch (error) {
    console.error('Error updating contact message:', error);
    return new Response(JSON.stringify({ 
      error: 'Erreur lors de la mise à jour du message' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE - Delete a contact message
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    return await DatabaseUtil.withDatabase('contact', async (db) => {
      const stmt = db.prepare(`DELETE FROM contact_messages WHERE id = ?`);
      const result = await stmt.run(data.id);
      
      if (result.changes === 0) {
        return new Response(JSON.stringify({ 
          error: 'Message non trouvé' 
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Message supprimé avec succès' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return new Response(JSON.stringify({ 
      error: 'Erreur lors de la suppression du message' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};