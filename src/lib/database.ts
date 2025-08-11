import Database from 'better-sqlite3';
import { join } from 'path';

/**
 * Database utility class that handles path resolution for different environments
 * Fixes issues with SQLite database access on Vercel serverless functions
 */
export class DatabaseUtil {
  private static getDatabasePath(dbName: string): string {
    // Use process.cwd() to get the current working directory
    // This works both locally and on Vercel
    const basePath = process.cwd();
    return join(basePath, 'data', dbName);
  }

  /**
   * Get a database connection with the correct path for the environment
   * @param dbName - Name of the database file (e.g., 'reservations.sqlite')
   * @returns Database instance
   */
  static getDatabase(dbName: string): Database.Database {
    const dbPath = this.getDatabasePath(dbName);
    return new Database(dbPath);
  }

  /**
   * Execute a query and automatically close the database connection
   * @param dbName - Name of the database file
   * @param queryFn - Function that takes the database and returns results
   * @returns Query results
   */
  static async withDatabase<T>(
    dbName: string,
    queryFn: (db: Database.Database) => T
  ): Promise<T> {
    const db = this.getDatabase(dbName);
    try {
      return queryFn(db);
    } finally {
      db.close();
    }
  }

  /**
   * Get the absolute path to a database file
   * @param dbName - Name of the database file
   * @returns Absolute path to the database
   */
  static getDatabaseAbsolutePath(dbName: string): string {
    return this.getDatabasePath(dbName);
  }
}

// Convenience functions for commonly used databases
export const getReservationsDb = () => DatabaseUtil.getDatabase('reservations.sqlite');
export const getContactDb = () => DatabaseUtil.getDatabase('contact.sqlite');
export const getServicesDb = () => DatabaseUtil.getDatabase('services.sqlite');
export const getTeamDb = () => DatabaseUtil.getDatabase('team.sqlite');
export const getTestimonialsDb = () => DatabaseUtil.getDatabase('testimonials.sqlite');
export const getFormationsDb = () => DatabaseUtil.getDatabase('formations.sqlite');
export const getFaqsDb = () => DatabaseUtil.getDatabase('faqs.sqlite');
export const getSiteSettingsDb = () => DatabaseUtil.getDatabase('site_settings.sqlite');
export const getGalleryDb = () => DatabaseUtil.getDatabase('gallery.sqlite');