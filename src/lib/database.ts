import { createClient, type Client } from '@libsql/client';
import { join } from 'path';

/**
 * Compatibility wrapper for libSQL client to match better-sqlite3 API
 */
class LibSQLWrapper {
  constructor(private client: Client) {}

  prepare(sql: string) {
    return {
      all: async (...params: any[]) => {
        const result = await this.client.execute({ sql, args: params });
        return result.rows.map(row => {
          const obj: any = {};
          result.columns.forEach((col, idx) => {
            obj[col] = row[idx];
          });
          return obj;
        });
      },
      
      get: async (...params: any[]) => {
        const result = await this.client.execute({ sql, args: params });
        if (result.rows.length === 0) return null;
        const obj: any = {};
        result.columns.forEach((col, idx) => {
          obj[col] = result.rows[0][idx];
        });
        return obj;
      },
      
      run: async (...params: any[]) => {
        const result = await this.client.execute({ sql, args: params });
        return {
          changes: result.rowsAffected,
          lastInsertRowid: result.lastInsertRowid
        };
      }
    };
  }

  async exec(sql: string) {
    return await this.client.execute(sql);
  }

  close() {
    this.client.close();
  }
}

/**
 * Database utility class that handles connections to Turso (libSQL)
 * Provides seamless serverless database access for production environments
 */
export class DatabaseUtil {
  private static client: Client | null = null;

  private static getClient(): Client {
    if (!this.client) {
      const url = process.env.TURSO_DATABASE_URL;
      const authToken = process.env.TURSO_AUTH_TOKEN;
      
      if (!url) {
        // For build time and development, use a local database fallback
        console.warn('TURSO_DATABASE_URL not found, using local fallback (this should not happen in production)');
        this.client = createClient({
          url: 'file:local.db'
        });
      } else {
        // Create client with auth token if provided
        this.client = createClient({
          url,
          authToken: authToken || undefined
        });
      }
    }
    
    return this.client;
  }

  /**
   * Get a database connection to Turso with better-sqlite3 compatibility
   * @param dbName - Database name (for compatibility, but Turso uses single DB)
   * @returns LibSQL wrapper with sqlite3-like API
   */
  static getDatabase(dbName: string): LibSQLWrapper {
    try {
      const client = this.getClient();
      console.log(`Connected to Turso database (table context: ${dbName})`);
      return new LibSQLWrapper(client);
    } catch (error) {
      console.error(`Failed to connect to Turso database:`, error);
      throw error;
    }
  }

  /**
   * Execute a query and return results
   * @param dbName - Database/table context name
   * @param queryFn - Function that takes the database client and returns results
   * @returns Query results
   */
  static async withDatabase<T>(
    dbName: string,
    queryFn: (db: LibSQLWrapper) => T | Promise<T>
  ): Promise<T> {
    const db = this.getDatabase(dbName);
    try {
      const result = await queryFn(db);
      return result;
    } catch (error) {
      console.error(`Database operation failed for ${dbName}:`, error);
      throw error;
    }
  }

  /**
   * Get the database URL for compatibility
   * @param dbName - Database name (ignored for Turso)
   * @returns Database URL
   */
  static getDatabaseAbsolutePath(dbName: string): string {
    return process.env.TURSO_DATABASE_URL || 'no-turso-url-configured';
  }

  /**
   * Close the database connection
   */
  static close(): void {
    if (this.client) {
      this.client.close();
      this.client = null;
    }
  }
}

// Convenience functions for commonly used databases
export const getReservationsDb = () => DatabaseUtil.getDatabase('reservations');
export const getContactDb = () => DatabaseUtil.getDatabase('contact');  
export const getServicesDb = () => DatabaseUtil.getDatabase('services');
export const getTeamDb = () => DatabaseUtil.getDatabase('team');
export const getTestimonialsDb = () => DatabaseUtil.getDatabase('testimonials');
export const getFormationsDb = () => DatabaseUtil.getDatabase('formations');
export const getFaqsDb = () => DatabaseUtil.getDatabase('faqs');
export const getSiteSettingsDb = () => DatabaseUtil.getDatabase('site_settings');
export const getGalleryDb = () => DatabaseUtil.getDatabase('gallery');