# 🔵 CropMind Frontend - Vercel Deployment Guide

Complete step-by-step guide to deploy the CropMind AI frontend on Vercel.

---

## Prerequisites

- [x] GitHub account with CropMind repository
- [x] Vercel account (free tier available)
- [x] **Backend already deployed on Render** (get URL first!)
- [x] Firebase project configured

---

## Step 1: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import"** next to your GitHub repository
4. Vercel auto-detects **Next.js** framework

---

## Step 2: Configure Project

### Build Settings (Usually Auto-Detected):

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |

---

## Step 3: Configure Environment Variables

Click **"Environment Variables"** and add:

### Backend Connection (REQUIRED):

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-cropmind-backend.onrender.com` | All |

> ⚠️ **Replace with your actual Render backend URL!**

### Firebase Authentication (REQUIRED):

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `your-project-id` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your app ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-XXXXXXXXXX` |

### App Configuration:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_APP_NAME` | `CropMind AI` |
| `NEXT_PUBLIC_ENABLE_PHONE_AUTH` | `false` |
| `NEXT_PUBLIC_ENABLE_DEMO_MODE` | `false` |

---

## Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Install dependencies
   - Build the Next.js application
   - Deploy to edge network
3. Wait for deployment to complete (~2-3 minutes)

---

## Step 5: Verify Deployment

### Check Your App:
1. Click the generated URL (e.g., `https://cropmind-xxx.vercel.app`)
2. Verify the landing page loads
3. Test login with Firebase authentication
4. Test chat functionality (requires working backend)

### Verify Backend Connection:
Open browser DevTools (F12) → Network tab → Check API calls go to your Render backend.

---

## Step 6: Update Render CORS

**CRITICAL**: Go back to Render and update `CORS_ORIGINS`:

```
CORS_ORIGINS=https://cropmind-xxx.vercel.app,http://localhost:3000
```

Replace `cropmind-xxx.vercel.app` with your actual Vercel URL!

---

## Step 7: Custom Domain (Optional)

### Add Custom Domain:
1. Go to **Project Settings** → **Domains**
2. Add your domain (e.g., `cropmind.com`)
3. Follow DNS configuration instructions
4. Vercel provides free SSL

### Update Render CORS for Custom Domain:
```
CORS_ORIGINS=https://cropmind.com,https://www.cropmind.com,http://localhost:3000
```

---

## Environment Variables Reference

Copy this full list to Vercel:

```env
# Backend Connection
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com

# App Config
NEXT_PUBLIC_APP_NAME=CropMind AI

# Firebase (get from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-xxx

# Feature Flags
NEXT_PUBLIC_ENABLE_PHONE_AUTH=false
NEXT_PUBLIC_ENABLE_DEMO_MODE=false
```

---

## Troubleshooting

### Build Fails
- Check that `frontend/` is set as root directory
- Verify `package.json` exists in frontend folder
- Check build logs for missing dependencies

### API Calls Fail
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check Render backend is running
- Check CORS is configured on Render

### Authentication Fails
- Verify all Firebase environment variables are set
- Add Vercel domain to Firebase authorized domains:
  - Firebase Console → Authentication → Settings → Authorized domains

### Blank Page / Errors
- Check browser console (F12) for errors
- Verify environment variables are set for "Production"

---

## Auto-Deployments

Vercel auto-deploys on every push to your main branch!

To disable:
1. Project Settings → Git
2. Toggle off "Auto-deploy"

---

## Quick Reference

| Resource | URL |
|----------|-----|
| Vercel Dashboard | [vercel.com/dashboard](https://vercel.com/dashboard) |
| Your App | `https://your-app.vercel.app` |
| Deployment Logs | Dashboard → Project → Deployments |
| Environment Variables | Dashboard → Project → Settings → Environment Variables |

---

## Deployment Checklist

- [ ] Render backend deployed and healthy
- [ ] Vercel project imported from GitHub
- [ ] `NEXT_PUBLIC_API_URL` set to Render URL
- [ ] All Firebase variables configured
- [ ] Render CORS updated with Vercel domain
- [ ] Login and chat functionality tested
- [ ] (Optional) Custom domain configured
