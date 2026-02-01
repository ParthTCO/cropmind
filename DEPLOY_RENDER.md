# 🟠 CropMind Backend - Render Deployment Guide

Complete step-by-step guide to deploy the CropMind AI backend on Render.com.

---

## Prerequisites

- [x] GitHub account with CropMind repository
- [x] Render.com account (free tier available)
- [x] Groq API key from [console.groq.com](https://console.groq.com)
- [x] Pinecone API key from [pinecone.io](https://www.pinecone.io/)
- [ ] (Optional) OpenWeatherMap API key

---

## Step 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `cropmind-db`
   - **Database**: `cropmind`
   - **User**: `cropmind_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free (or upgrade for production)
4. Click **"Create Database"**
5. Wait for database to be ready (~2 minutes)
6. **Copy the "Internal Database URL"** - you'll need this!

---

## Step 2: Create Backend Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:

   | Setting | Value |
   |---------|-------|
   | **Name** | `cropmind-backend` |
   | **Region** | Same as database |
   | **Branch** | `main` (or your branch) |
   | **Root Directory** | `backend` |
   | **Runtime** | `Docker` |
   | **Instance Type** | Free (or upgrade) |

4. Click **"Create Web Service"**

---

## Step 3: Configure Environment Variables

Go to your web service → **"Environment"** → **"Add Environment Variable"**

### Required Variables:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | Auto-linked | Link to your Render Postgres |
| `GROQ_API_KEY` | `gsk_xxx...` | From Groq Console |
| `PINECONE_API_KEY` | `pcsk_xxx...` | From Pinecone Console |
| `PINECONE_HOST` | `https://cropmind-xxx.svc.xxx.pinecone.io` | Your Pinecone index URL |
| `PINECONE_INDEX` | `cropmind` | Your index name |

### CORS Configuration (CRITICAL!):

| Key | Value |
|-----|-------|
| `CORS_ORIGINS` | `https://your-app.vercel.app,http://localhost:3000` |

> ⚠️ **Update `CORS_ORIGINS`** with your actual Vercel URL after frontend deployment!

### Optional Variables:

| Key | Value | Default |
|-----|-------|---------|
| `WEATHER_API_KEY` | Your OpenWeatherMap key | Uses mock data |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` | Default model |
| `LOG_LEVEL` | `INFO` | Logging level |
| `ENABLE_RAG` | `true` | Enable vector search |
| `ENABLE_WEATHER_API` | `true` | Enable weather |

---

## Step 4: Link Database

1. In your web service, go to **"Environment"**
2. Click **"Add Environment Variable"**
3. Select **"Link"** → Choose your `cropmind-db` database
4. Render will auto-populate `DATABASE_URL`

---

## Step 5: Deploy

1. Render auto-deploys on push to main branch
2. For manual deploy: Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Watch the logs for successful startup:
   ```
   ✓ Configuration validated successfully
   ✓ CropMind AI Backend starting on 0.0.0.0:8000
   ```

---

## Step 6: Verify Deployment

### Check Health Endpoint:
```bash
curl https://cropmind-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "app": "CropMind AI Backend",
  "version": "1.0.0",
  "rag_enabled": true,
  "weather_api_enabled": true,
  "multilingual_enabled": true
}
```

### Check API Docs:
Visit: `https://cropmind-backend.onrender.com/docs`

---

## Step 7: Copy Backend URL

📋 Copy your backend URL for Vercel deployment:
```
https://cropmind-backend.onrender.com
```

Use this as `NEXT_PUBLIC_API_URL` in Vercel!

---

## Troubleshooting

### Build Fails
- Check Dockerfile is in `backend/` directory
- Verify `requirements.txt` has all dependencies

### Database Connection Error
- Ensure DATABASE_URL is linked (not manually entered)
- Check database is in same region as web service

### Health Check Fails
- Verify `/health` endpoint exists in code
- Check logs for startup errors

### CORS Errors
- Update `CORS_ORIGINS` with your Vercel domain
- Include both `https://` and trailing paths if needed

---

## Quick Reference

| Resource | URL |
|----------|-----|
| Render Dashboard | [dashboard.render.com](https://dashboard.render.com) |
| API Docs | `https://your-backend.onrender.com/docs` |
| Health Check | `https://your-backend.onrender.com/health` |
| Logs | Render Dashboard → Service → Logs |
