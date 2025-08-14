# Neill Beauty Turso Migration Setup Guide

This guide helps you complete the migration from SQLite to Turso (libSQL) for production deployment.

## Prerequisites

1. **Create a Turso account**: Go to [https://turso.tech](https://turso.tech)
2. **Install Turso CLI** (optional but recommended):
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```

## Setup Steps

### 1. Create Turso Database

Using the Turso CLI:
```bash
# Login to your Turso account
turso auth login

# Create the database (replace with your preferred name)
turso db create neill-astro

# Get the database URL
turso db show neill-astro --url

# Create an auth token
turso db tokens create neill-astro
```

### 2. Environment Variables

Add these to your `.env` file and deployment environment:

```env
# Turso Database Configuration
TURSO_DATABASE_URL=your_database_url_here
TURSO_AUTH_TOKEN=your_auth_token_here
```

For Vercel deployment, add these environment variables in your Vercel dashboard.

### 3. Setup Database Schema and Migrate Data

**Option A: Complete Setup (Recommended)**
Run the complete setup script to both create schema and migrate existing data:

```bash
npm run turso-complete-setup
```

**Option B: Step-by-Step Setup**
If you prefer to run each step separately:

```bash
# Step 1: Create database schema
npm run setup-turso

# Step 2: Migrate existing SQLite data to Turso
npm run migrate-to-turso
```

### 4. Verify Migration

After running the setup, verify that your data has been migrated successfully:

1. **Check Turso Dashboard**: Visit your Turso dashboard to see the tables and data
2. **Test Admin Panel**: Access `/admin` on your application  
3. **Test API Endpoints**: Verify that data is being returned correctly

### 5. Test the Migration

Start the development server and test the API endpoints:

```bash
npm run dev
```

Test API endpoints:
```bash
# Test with admin cookie (replace with actual auth)
curl -H "Cookie: admin-session=authenticated" http://localhost:4321/api/admin/formations
```

## Production Deployment

1. **Set Environment Variables** in your deployment platform
2. **Deploy** - the app will automatically use Turso in production
3. **Monitor** - check logs for any connection issues

## Benefits of Migration

✅ **Serverless Compatible**: Works perfectly with Vercel, Netlify, etc.  
✅ **Better Performance**: Lower latency with edge locations  
✅ **Scalability**: Handle more concurrent connections  
✅ **Reliability**: No cold start database copy issues  
✅ **Development Experience**: Same SQL syntax, better tooling  

## Troubleshooting

### "Database is empty" Issue
If your Turso database appears empty after setting up environment variables:

1. **Run diagnostics first**: Check your current setup status
   ```bash
   npm run turso-diagnostics
   ```

2. **Run the setup script**: The database tables don't exist yet
   ```bash
   npm run turso-complete-setup
   ```

2. **Check environment variables**: Ensure `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set
   ```bash
   # In your terminal (for local testing)
   export TURSO_DATABASE_URL="your_database_url"
   export TURSO_AUTH_TOKEN="your_auth_token"
   ```

3. **Verify Vercel environment variables**: 
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Ensure both `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set
   - Redeploy your application after setting variables

### Admin Panel 500 Error
If you're getting 500 errors in the admin panel:

1. **Database tables missing**: Run the setup script first
   ```bash
   npm run setup-turso
   ```

2. **Check application logs**: 
   - Local: Check terminal running `npm run dev`
   - Vercel: Check Function Logs in Vercel dashboard

3. **Test database connection**:
   ```bash
   # Test if Turso connection works
   node -e "
   import { createClient } from '@libsql/client';
   const client = createClient({
     url: process.env.TURSO_DATABASE_URL,
     authToken: process.env.TURSO_AUTH_TOKEN
   });
   client.execute('SELECT 1').then(() => console.log('✅ Connection OK')).catch(err => console.error('❌ Connection failed:', err));
   " --input-type=module
   ```

### Connection Issues
- Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set correctly
- Check that your Turso database is accessible
- Ensure auth token has the right permissions

### Schema Issues  
- Run `node scripts/setup-turso-db.js` to recreate tables
- Check the Turso dashboard for table structure

### API Errors
- Check server logs for specific database errors  
- Verify the libSQL client is connecting properly
- Test with simple queries first

## Support

For issues:
1. Check Turso documentation: https://docs.turso.tech
2. Review the database connection logs
3. Test with Turso CLI commands directly