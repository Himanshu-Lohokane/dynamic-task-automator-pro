# 🚀 Multi-Media Knowledge Base - Vercel Deployment Guide

This comprehensive guide will walk you through deploying your multi-media knowledge base application to Vercel from GitHub, including all necessary environment variables, API keys, and configuration steps.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Database Setup](#database-setup)
- [n8n Webhook Configuration](#n8n-webhook-configuration)
- [GitHub Repository Setup](#github-repository-setup)
- [Vercel Project Setup](#vercel-project-setup)
- [Environment Variables](#environment-variables)
- [Deployment Steps](#deployment-steps)
- [Post-Deployment Configuration](#post-deployment-configuration)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before starting, ensure you have:
- A GitHub account
- A Vercel account (free tier is sufficient)
- A Neon (or PostgreSQL) database account
- Access to your n8n instance at `kasimlohar.app.n8n.cloud`
- Your n8n webhook URLs and credentials

## 🗄️ Database Setup

### Option 1: Neon Database (Recommended)

1. **Create Neon Account:**
   - Go to https://neon.tech/
   - Sign up for a free account
   - Create a new project

2. **Get Database URL:**
   - After creating the project, go to the "Connection Details" section
   - Copy the connection string (it looks like: `postgresql://username:password@hostname:port/database?sslmode=require`)
   - Save this as your `DATABASE_URL`

### Option 2: Alternative PostgreSQL Providers
- **Supabase:** https://supabase.com/
- **Railway:** https://railway.app/
- **PlanetScale:** https://planetscale.com/
- **AWS RDS, Google Cloud SQL, etc.**

## 🔗 n8n Webhook Configuration

Your application uses several n8n webhooks for different file types. You'll need these webhook URLs:

### Current Webhook Configuration:

**Production Webhooks:**
- **PDF Upload:** `https://kasimlohar.app.n8n.cloud/webhook/pdf-ingest`
- **Image Upload:** `https://kasimlohar.app.n8n.cloud/webhook/image-ingest`
- **Video Upload:** `https://kasimlohar.app.n8n.cloud/webhook/9cb9c3ff-f43f-4579-b21b-30dafc30c87b`
- **Audio Upload:** `https://kasimlohar.app.n8n.cloud/webhook/2bb25d11-1ed8-4299-9ef4-f5bf091c3695`
- **Chat Interface:** `https://kasimlohar.app.n8n.cloud/webhook/bdd9a358-e97e-4da2-8aed-6fd474dec5a7`

**Test Webhooks:**
- **PDF Upload:** `https://kasimlohar.app.n8n.cloud/webhook-test/pdf-ingest`
- **Image Upload:** `https://kasimlohar.app.n8n.cloud/webhook-test/image-ingest`
- **Video Upload:** `https://kasimlohar.app.n8n.cloud/webhook-test/9cb9c3ff-f43f-4579-b21b-30dafc30c87b`
- **Audio Upload:** `https://kasimlohar.app.n8n.cloud/webhook-test/2bb25d11-1ed8-4299-9ef4-f5bf091c3695`
- **Chat Interface:** `https://kasimlohar.app.n8n.cloud/webhook-test/bdd9a358-e97e-4da2-8aed-6fd474dec5a7`

### n8n Setup Requirements:

1. **Verify Webhook Accessibility:**
   - Test each webhook URL to ensure they're active
   - Make sure your n8n workflows are properly configured
   - Ensure Pinecone Vector Store nodes are enabled (if using vector storage)

2. **Webhook Response Format:**
   Your n8n workflows should return responses in this format:
   ```json
   {
     "output": "AI generated description/response",
     "success": true,
     "data": {
       "message": "Additional details"
     }
   }
   ```

## 📂 GitHub Repository Setup

1. **Push Code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Multi-media knowledge base"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

2. **Repository Structure Check:**
   Ensure your repository has this structure:
   ```
   your-repo/
   ├── client/
   │   └── src/
   ├── server/
   ├── shared/
   ├── package.json
   ├── vite.config.ts
   ├── drizzle.config.ts
   └── migrations/
   ```

## ⚡ Vercel Project Setup

1. **Create New Project:**
   - Go to https://vercel.com/
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings:**
   - **Framework Preset:** Other
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Advanced Build Settings:**
   - **Node.js Version:** 18.x or 20.x
   - **Package Manager:** npm

## 🔐 Environment Variables

In your Vercel project settings, add these environment variables:

### Required Environment Variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"

# Application Environment
NODE_ENV="production"

# n8n Webhook URLs (Production)
N8N_PDF_WEBHOOK_URL="https://kasimlohar.app.n8n.cloud/webhook/pdf-ingest"
N8N_IMAGE_WEBHOOK_URL="https://kasimlohar.app.n8n.cloud/webhook/image-ingest"
N8N_VIDEO_WEBHOOK_URL="https://kasimlohar.app.n8n.cloud/webhook/9cb9c3ff-f43f-4579-b21b-30dafc30c87b"
N8N_AUDIO_WEBHOOK_URL="https://kasimlohar.app.n8n.cloud/webhook/2bb25d11-1ed8-4299-9ef4-f5bf091c3695"
N8N_CHAT_WEBHOOK_URL="https://kasimlohar.app.n8n.cloud/webhook/bdd9a358-e97e-4da2-8aed-6fd474dec5a7"

# n8n Webhook URLs (Test)
N8N_PDF_WEBHOOK_TEST_URL="https://kasimlohar.app.n8n.cloud/webhook-test/pdf-ingest"
N8N_IMAGE_WEBHOOK_TEST_URL="https://kasimlohar.app.n8n.cloud/webhook-test/image-ingest"
N8N_VIDEO_WEBHOOK_TEST_URL="https://kasimlohar.app.n8n.cloud/webhook-test/9cb9c3ff-f43f-4579-b21b-30dafc30c87b"
N8N_AUDIO_WEBHOOK_TEST_URL="https://kasimlohar.app.n8n.cloud/webhook-test/2bb25d11-1ed8-4299-9ef4-f5bf091c3695"
N8N_CHAT_WEBHOOK_TEST_URL="https://kasimlohar.app.n8n.cloud/webhook-test/bdd9a358-e97e-4da2-8aed-6fd474dec5a7"
```

### Optional Environment Variables:

```bash
# If you need session secrets
SESSION_SECRET="your-super-secret-session-key-here"

# If you're using specific API keys for n8n authentication
N8N_API_KEY="your-n8n-api-key-if-needed"

# File upload limits (optional, has defaults)
MAX_PDF_SIZE="10485760"    # 10MB in bytes
MAX_IMAGE_SIZE="10485760"  # 10MB in bytes
MAX_VIDEO_SIZE="104857600" # 100MB in bytes
MAX_AUDIO_SIZE="52428800"  # 50MB in bytes
```

## 🚀 Deployment Steps

### Step 1: Initial Deployment
1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. If the build fails, check the build logs for errors

### Step 2: Database Migration
After successful deployment, run database migrations:

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Link Project:**
   ```bash
   vercel link
   ```

4. **Run Database Migration:**
   ```bash
   vercel env pull .env.local
   npm run db:push
   ```

### Step 3: Verify Deployment
- Visit your Vercel deployment URL
- Test file uploads in each tab (PDF, Image, Video, Audio)
- Check the Documents dashboard
- Test the chat interface

## ⚙️ Post-Deployment Configuration

### Domain Configuration (Optional)
1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed

### CORS Configuration
If you encounter CORS issues:
1. Update your n8n webhook settings to allow your Vercel domain
2. Add your Vercel domain to any API whitelist

### File Size Limits
Vercel has the following limits:
- **Hobby Plan:** 100MB deployment size, 5MB serverless function size
- **Pro Plan:** 500MB deployment size, 50MB serverless function size

## 🔧 Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Verify TypeScript compilation

2. **Database Connection Issues:**
   - Verify DATABASE_URL is correct
   - Check database server accessibility
   - Ensure SSL mode is properly configured

3. **n8n Webhook Failures:**
   - Test webhook URLs manually
   - Check n8n workflow status
   - Verify webhook response format

4. **File Upload Issues:**
   - Check Vercel function timeout limits
   - Verify file size limits
   - Test with smaller files first

### Debug Commands:

```bash
# Check deployment logs
vercel logs [deployment-url]

# Test database connection locally
npm run check

# Build locally to test
npm run build

# Test production build locally
npm run start
```

### Environment Variable Verification:

Add this to your server code temporarily to verify env vars:
```javascript
console.log('Environment check:', {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'MISSING',
  // Don't log actual values in production
});
```

## 📞 Support & Additional Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Neon Documentation:** https://neon.tech/docs
- **n8n Documentation:** https://docs.n8n.io/

## 🔒 Security Notes

- Never commit environment variables to Git
- Use Vercel's environment variable interface
- Regularly rotate API keys and database passwords
- Monitor webhook endpoints for unauthorized access

---

## 🎯 Quick Deployment Checklist

- [ ] GitHub repository created and code pushed
- [ ] Neon database created and DATABASE_URL obtained
- [ ] All n8n webhooks tested and working
- [ ] Vercel project created and connected to GitHub
- [ ] All environment variables configured in Vercel
- [ ] Initial deployment successful
- [ ] Database migrations completed
- [ ] File uploads tested (PDF, Image, Video, Audio)
- [ ] Chat interface working
- [ ] Documents dashboard displaying uploaded files
- [ ] Custom domain configured (optional)

**Your multi-media knowledge base is now live on Vercel! 🎉**