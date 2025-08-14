#!/usr/bin/env node
/**
 * Vercel Build Hook - Pre-deployment Setup
 * Ensures database is ready before building the application
 */

import { EnvironmentSetup } from './environment-setup.js';

class VercelBuildSetup extends EnvironmentSetup {
  constructor() {
    super();
    this.isVercelBuild = !!process.env.VERCEL;
    this.isPreview = process.env.VERCEL_ENV === 'preview';
    this.isProduction = process.env.VERCEL_ENV === 'production';
  }

  log(message, type = 'info') {
    // Vercel-friendly logging
    const prefix = {
      info: '▲',
      success: '✓',
      warning: '⚠',
      error: '✗'
    };
    console.log(`${prefix[type]} ${message}`);
  }

  async run() {
    console.log('▲ Neill Beauty - Vercel Pre-build Setup\n');
    
    if (!this.isVercelBuild) {
      this.log('Not running on Vercel, using standard setup', 'warning');
      return super.run();
    }
    
    this.log(`Environment: ${process.env.VERCEL_ENV || 'development'}`, 'info');
    
    try {
      // Step 1: Check environment variables (critical for production)
      const hasValidEnv = await this.checkEnvironmentVariables();
      
      if (!hasValidEnv && this.isProduction) {
        throw new Error('Database configuration required for production deployment');
      }
      
      if (hasValidEnv) {
        // Step 2: Test database connection
        await this.testDatabaseConnection();
        
        // Step 3: Setup database if needed
        const tablesExist = await this.checkDatabaseTables();
        
        if (!tablesExist) {
          this.log('Setting up database for first deployment...', 'info');
          await this.setupDatabase();
          await this.migrateData();
          
          // Verify setup worked
          await this.checkDatabaseTables();
        }
      } else if (this.isPreview) {
        this.log('Preview deployment without database - proceeding with build', 'warning');
      }
      
      this.log('Pre-build setup completed successfully!', 'success');
      
    } catch (error) {
      this.log(`Pre-build setup failed: ${error.message}`, 'error');
      
      // For preview deployments, we can continue without database
      if (this.isPreview) {
        this.log('Continuing with preview build (database errors ignored)', 'warning');
      } else {
        this.log('Critical failure in production deployment', 'error');
        process.exit(1);
      }
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new VercelBuildSetup();
  setup.run();
}

export { VercelBuildSetup };