#!/usr/bin/env node
/**
 * Health Check Script for Neill Beauty
 * Verifies database connectivity and essential services
 */

import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

class HealthChecker {
  constructor() {
    this.checks = [];
    this.results = [];
  }

  addCheck(name, checkFunction) {
    this.checks.push({ name, check: checkFunction });
  }

  async runAllChecks() {
    console.log('🏥 Neill Beauty - Health Check Starting...\n');
    
    for (const { name, check } of this.checks) {
      try {
        console.log(`📋 ${name}...`);
        const result = await check();
        this.results.push({ name, status: 'PASS', result, error: null });
        console.log(`  ✅ PASS: ${result}\n`);
      } catch (error) {
        this.results.push({ name, status: 'FAIL', result: null, error: error.message });
        console.log(`  ❌ FAIL: ${error.message}\n`);
      }
    }

    this.printSummary();
    return this.isHealthy();
  }

  isHealthy() {
    return this.results.every(result => result.status === 'PASS');
  }

  printSummary() {
    console.log('📊 HEALTH CHECK SUMMARY');
    console.log('='.repeat(50));
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total:  ${this.results.length}\n`);
    
    if (failed > 0) {
      console.log('❌ FAILED CHECKS:');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(r => console.log(`  - ${r.name}: ${r.error}`));
      console.log();
    }
    
    const overallStatus = this.isHealthy() ? '✅ HEALTHY' : '❌ UNHEALTHY';
    console.log(`🎯 OVERALL STATUS: ${overallStatus}`);
  }
}

// Health check functions
async function checkEnvironmentVariables() {
  const required = ['TURSO_DATABASE_URL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return 'All required environment variables are set';
}

async function checkDatabaseConnection() {
  if (!TURSO_URL) {
    throw new Error('TURSO_DATABASE_URL not configured');
  }
  
  const client = createClient({
    url: TURSO_URL,
    authToken: TURSO_AUTH_TOKEN || undefined
  });
  
  await client.execute('SELECT 1 as test');
  return 'Database connection successful';
}

async function checkDatabaseTables() {
  const client = createClient({
    url: TURSO_URL,
    authToken: TURSO_AUTH_TOKEN || undefined
  });
  
  const expectedTables = [
    'services', 'formations', 'team_members', 'testimonials', 
    'faqs', 'gallery_items', 'reservations', 'contact_messages', 
    'time_slots', 'site_settings'
  ];
  
  const tablesResult = await client.execute(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `);
  
  const existingTables = tablesResult.rows.map(row => row.name);
  const missingTables = expectedTables.filter(table => !existingTables.includes(table));
  
  if (missingTables.length > 0) {
    throw new Error(`Missing tables: ${missingTables.join(', ')}`);
  }
  
  return `All ${expectedTables.length} required tables exist`;
}

async function checkBuildOutput() {
  const distPath = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distPath)) {
    throw new Error('Build output directory (dist) not found');
  }
  
  // Check for Astro/Vercel build output structure
  const clientIndexPath = path.join(distPath, 'client', 'index.html');
  const rootIndexPath = path.join(distPath, 'index.html');
  
  if (fs.existsSync(clientIndexPath)) {
    return 'Build output is valid (Astro/Vercel structure)';
  } else if (fs.existsSync(rootIndexPath)) {
    return 'Build output is valid (standard structure)';
  } else {
    throw new Error('Main index.html not found in build output');
  }
}

async function checkPackageDependencies() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const criticalDeps = ['@libsql/client', 'astro', '@astrojs/vercel'];
  
  const missing = criticalDeps.filter(dep => 
    !packageJson.dependencies[dep] && !packageJson.devDependencies?.[dep]
  );
  
  if (missing.length > 0) {
    throw new Error(`Missing critical dependencies: ${missing.join(', ')}`);
  }
  
  return 'All critical dependencies are present';
}

// Main execution
async function main() {
  const checker = new HealthChecker();
  
  // Add all health checks
  checker.addCheck('Environment Variables', checkEnvironmentVariables);
  checker.addCheck('Database Connection', checkDatabaseConnection);
  checker.addCheck('Database Tables', checkDatabaseTables);
  checker.addCheck('Package Dependencies', checkPackageDependencies);
  
  // Only check build output if dist exists (optional for development)
  if (fs.existsSync('dist')) {
    checker.addCheck('Build Output', checkBuildOutput);
  }
  
  const isHealthy = await checker.runAllChecks();
  
  // Exit with appropriate code
  process.exit(isHealthy ? 0 : 1);
}

main().catch(error => {
  console.error('❌ Health check script failed:', error);
  process.exit(1);
});