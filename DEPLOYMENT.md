# 🚀 Deployment Guide - Metasurface Simulator

This guide will help you deploy the Metasurface Simulator to the web using **Netlify** (frontend) and **Render** (backend).

---

## 📋 Prerequisites

- GitHub account
- Netlify account (free at https://netlify.com)
- Render account (free at https://render.com)

---

## Step 1: Push Your Code to GitHub

First, create a GitHub repository and push your code:

```bash
cd "/Users/hvishwajit/1 bit/metasurface-simulator"

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/metasurface-simulator.git

# Push to GitHub
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

### 2.1 Create a New Web Service on Render

1. Go to https://render.com and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `metasurface-api` |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn server:app --bind 0.0.0.0:$PORT` |

5. Under **Environment Variables**, add:
   - `CORS_ORIGINS` = `https://YOUR-NETLIFY-APP.netlify.app` (update after deploying frontend)

6. Click **"Create Web Service"**

7. Wait for deployment to complete and **copy the URL** (e.g., `https://metasurface-api.onrender.com`)

---

## Step 3: Deploy Frontend to Netlify

### 3.1 Create a New Site on Netlify

1. Go to https://netlify.com and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Configure build settings:

| Setting | Value |
|---------|-------|
| **Base directory** | (leave empty) |
| **Build command** | `npm run build` |
| **Publish directory** | `build` |

5. Click **"Show advanced"** → **"New variable"** and add:
   - `REACT_APP_API_URL` = `https://metasurface-api.onrender.com` (use your Render URL from Step 2)

6. Click **"Deploy site"**

---

## Step 4: Update CORS on Backend

After your Netlify site is live:

1. Go back to Render dashboard
2. Select your `metasurface-api` service
3. Go to **Environment** tab
4. Update `CORS_ORIGINS` to your Netlify URL:
   ```
   https://YOUR-SITE-NAME.netlify.app
   ```
5. The service will automatically redeploy

---

## ✅ Your App is Live!

Your metasurface simulator is now accessible at:
- **Frontend**: `https://YOUR-SITE-NAME.netlify.app`
- **Backend API**: `https://metasurface-api.onrender.com`

---

## 🔧 Troubleshooting

### "Simulation failed" error
- Check that the backend URL in Netlify environment variables is correct
- Make sure the Render service is running (free tier spins down after 15 min of inactivity)
- Check browser console for CORS errors

### CORS errors
- Verify `CORS_ORIGINS` on Render matches your Netlify URL exactly
- Make sure to include `https://` in the URL

### Backend is slow
- Render free tier has cold starts (15-30 seconds after inactivity)
- First request may take longer; subsequent requests will be fast

---

## 🔄 Updating Your Site

When you push changes to GitHub:
- **Netlify**: Automatically rebuilds and deploys
- **Render**: Automatically rebuilds and deploys

---

## 📱 Custom Domain (Optional)

### Netlify Custom Domain
1. Go to **Domain settings** in Netlify
2. Click **Add custom domain**
3. Follow DNS configuration instructions

### Render Custom Domain
1. Go to **Settings** → **Custom Domains** in Render
2. Add your domain and configure DNS

---

## 💡 Pro Tips

1. **Performance**: Render free tier sleeps after 15 min. Consider upgrading for production use.
2. **Environment**: Keep `REACT_APP_API_URL` in sync between local development and production
3. **Logs**: Check Netlify and Render logs for debugging deployment issues

---

**Congratulations! Your Metasurface Simulator is now live on the web! 🎉**

