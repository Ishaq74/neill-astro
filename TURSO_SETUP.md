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

### 3. Setup Database Schema

Run the schema setup script to create all necessary tables:

```bash
node scripts/setup-turso-db.js
```

### 4. Data Migration (Optional)

If you have existing data in SQLite files, you can migrate it using the Turso CLI:

```bash
# Example: Import data from SQLite file
turso db shell neill-astro < data/formations.sql
```

Or create a migration script to transfer data programmatically.

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