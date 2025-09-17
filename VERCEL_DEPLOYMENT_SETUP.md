# 🚀 Multi-Media Knowledge Base - Vercel Deployment Guide

This comprehensive guide will walk you through deploying your multi-media knowledge base application to Vercel from GitHub, including all necessary environment variables, API keys, and configuration steps.

## 🔧 Prerequisites

Before starting, ensure you have:
- A GitHub account
- A Vercel account (free tier is sufficient)
- Access to your n8n instance at `kasimlohar.app.n8n.cloud`
- Your n8n webhook URLs and credentials

## 🔗 n8n Webhook Configuration

Your application uses several n8n webhooks for different file types. You'll need these webhook URLs:

### Current Webhook Configuration:

**Production Webhooks:**
- **PDF Upload:** `${VITE_N8N_PDF_WEBHOOK_URL}`
- **Image Upload:** `${VITE_N8N_IMAGE_WEBHOOK_URL}`
- **Video Upload:** `${VITE_N8N_VIDEO_WEBHOOK_URL}`
- **Audio Upload:** `${VITE_N8N_AUDIO_WEBHOOK_URL}`
- **Chat Interface:** `${VITE_N8N_CHAT_WEBHOOK_URL}`

**Test Webhooks:**
- **PDF Upload:** `${VITE_N8N_PDF_WEBHOOK_TEST_URL}`
- **Image Upload:** `${VITE_N8N_IMAGE_WEBHOOK_TEST_URL}`
- **Video Upload:** `${VITE_N8N_VIDEO_WEBHOOK_TEST_URL}`
- **Audio Upload:** `${VITE_N8N_AUDIO_WEBHOOK_TEST_URL}`
- **Chat Interface:** `${VITE_N8N_CHAT_WEBHOOK_TEST_URL}`


1. **Push Code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Multi-media knowledge base"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
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

bash
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