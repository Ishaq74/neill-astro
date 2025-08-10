# Neill Beauty - Security Configuration Guide

## Production Security Checklist

### 🔒 HTTPS & SSL
- [ ] Force HTTPS in production
- [ ] Configure security headers
- [ ] Enable HSTS (HTTP Strict Transport Security)
- [ ] Set up CSP (Content Security Policy)

### 🛡️ Vercel Configuration
For Vercel deployment, add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

### 🔐 Environment Variables Security
- Use strong passwords for admin accounts
- Never commit API keys or secrets to Git
- Use environment variables for all sensitive data
- Enable 2FA where possible

### 📊 Database Security
- SQLite files should not be publicly accessible
- Regular backups (use provided backup script)
- Consider encryption for sensitive user data

### 🔍 Monitoring & Error Tracking
Consider integrating:
- **Sentry** for error monitoring
- **LogRocket** for user session replay
- **Google Analytics** for usage tracking

### 🛠️ Rate Limiting
For contact forms and reservations:
- Implement rate limiting to prevent spam
- Use CAPTCHA for public forms
- Monitor for unusual activity patterns

### 🎯 Quick Security Commands

```bash
# Run security audit
npm audit

# Fix vulnerabilities (be careful with --force)
npm audit fix

# Create database backup
./scripts/backup-database.sh

# Check for environment variables
echo "Checking for .env file..."
ls -la .env*
```

### 🚨 Emergency Response
If security issue detected:
1. Take site offline if necessary
2. Assess the scope of the issue
3. Fix the vulnerability
4. Review logs for unauthorized access
5. Notify affected users if needed
6. Update documentation