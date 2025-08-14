#!/usr/bin/env node
/**
 * Development Workflow Script
 * Provides guided setup and troubleshooting for development environment
 */

import { EnvironmentSetup } from './environment-setup.js';
import fs from 'fs';
import path from 'path';

class DevelopmentWorkflow {
  constructor() {
    // Don't instantiate setup here - we'll do it after env modification
    this.setup = null;
  }

  async run() {
    console.log('🚀 Neill Beauty - Development Environment Helper\n');
    
    console.log('This tool will help you set up your development environment.');
    console.log('Follow the steps below to get started:\n');
    
    // Step 1: Check if .env exists
    console.log('📋 Step 1: Environment Configuration');
    const envExists = fs.existsSync('.env');
    
    if (!envExists) {
      console.log('⚠️  .env file not found');
      console.log('✅ Creating .env from template...');
      
      if (fs.existsSync('.env.example')) {
        fs.copyFileSync('.env.example', '.env');
        console.log('✅ .env file created!\n');
        
        console.log('📝 Next: Edit your .env file with your Turso credentials:');
        console.log('   1. Get your database URL from Turso dashboard');
        console.log('   2. Get your auth token from Turso dashboard');
        console.log('   3. Update TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env\n');
        
        console.log('💡 Need help? Check TURSO_SETUP.md for detailed instructions\n');
      } else {
        console.log('❌ .env.example not found. Something might be wrong with your installation.');
      }
    } else {
      console.log('✅ .env file exists\n');
    }
    
    // Step 2: Try environment setup
    console.log('📋 Step 2: Environment Setup');
    
    // Force development environment for this workflow
    process.env.NODE_ENV = 'development';
    delete process.env.CI; // Remove CI flag for local development testing
    
    // Now create the setup instance with proper environment
    this.setup = new EnvironmentSetup();
    
    try {
      await this.setup.run();
      
      console.log('\n🎉 Development environment is ready!');
      console.log('\n📋 What you can do now:');
      console.log('   • npm run dev          - Start development server');
      console.log('   • npm run health-check - Run system diagnostics');
      console.log('   • npm run build        - Build for production');
      
    } catch (error) {
      console.log('\n⚠️  Environment setup completed with warnings');
      console.log(`   Note: ${error.message}`);
      
      console.log('\n🔧 To enable database features:');
      console.log('   1. Edit .env with your Turso credentials');
      console.log('   2. Run: npm run turso-diagnostics');
      console.log('   3. Run: npm run turso-complete-setup');
      console.log('   4. Check TURSO_SETUP.md for detailed help');
      
      console.log('\n✅ You can still run the app in development mode without database');
    }
    
    console.log('\n📚 Helpful resources:');
    console.log('   • CI-CD_SETUP.md     - CI/CD and deployment guide');
    console.log('   • TURSO_SETUP.md     - Database configuration');
    console.log('   • SOLUTION.md        - Common problem solutions');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const workflow = new DevelopmentWorkflow();
  workflow.run();
}

export { DevelopmentWorkflow };