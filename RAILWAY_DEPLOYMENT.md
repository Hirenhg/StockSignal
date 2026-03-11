# 🚂 Railway.app Deployment - Quick Guide (5 Minutes)

## ✅ Why Railway?
- **$5 free credit/month** (enough for 24/7 uptime)
- **No sleeping** (unlike Render free tier)
- **Auto-deploy from GitHub**
- **Easiest setup**

---

## 🚀 Deployment Steps

### Step 1: Sign Up (1 minute)
1. Go to https://railway.app
2. Click **"Login"**
3. Sign in with **GitHub**
4. Authorize Railway

### Step 2: Create Project (2 minutes)
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **"StockSignal"** repository
4. Railway auto-detects Node.js ✅

### Step 3: Configure (2 minutes)

#### 3.1 Settings
- Click **"Settings"** tab
- **Build Command:** `cd backend && npm install`
- **Start Command:** `cd backend && node server.js`
- **Root Directory:** Leave empty
- Click **"Save"**

#### 3.2 Environment Variables
- Click **"Variables"** tab
- Click **"+ New Variable"**

Add these one by one:
```
PORT = 5000
NODE_ENV = production
TELEGRAM_BOT_TOKEN = your_actual_bot_token
TELEGRAM_CHAT_ID = your_actual_chat_id
```

Click **"Add"** for each

### Step 4: Deploy (Auto)
- Railway automatically deploys!
- Wait 2-3 minutes
- Click **"Deployments"** to see progress

### Step 5: Get Your URL
1. Click **"Settings"** tab
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. Copy your URL: `https://stocksignal-backend.up.railway.app`

---

## 🔧 Update Frontend

### Update Vercel Environment Variable
1. Go to Vercel Dashboard
2. Select your project
3. Go to **"Settings"** → **"Environment Variables"**
4. Update `REACT_APP_API_URL`:
   ```
   https://stocksignal-backend.up.railway.app
   ```
5. Click **"Save"**
6. Redeploy frontend

---

## 🧪 Test Your Deployment

### Test 1: API Health
Visit: `https://stocksignal-backend.up.railway.app`

Should see:
```json
{
  "message": "Stock Signal API Running",
  "status": "healthy",
  "timestamp": "..."
}
```

### Test 2: Health Endpoint
Visit: `https://stocksignal-backend.up.railway.app/api/health`

### Test 3: Telegram
Visit: `https://stocksignal-backend.up.railway.app/api/telegram/test`

Check Telegram for message! 📱

### Test 4: Frontend
Visit your Vercel URL and click refresh

---

## ✅ Done!

Your app is now live 24/7 with:
- ✅ Automatic Telegram messages
- ✅ No sleeping (Railway doesn't sleep)
- ✅ Auto-deploy on git push
- ✅ $5 free credit/month

---

## 💰 Usage Monitoring

### Check Your Usage
1. Go to Railway Dashboard
2. Click your project
3. See **"Usage"** in sidebar
4. Monitor your $5 credit

**Typical Usage:**
- Small app like yours: ~$2-3/month
- Your $5 credit is enough! ✅

---

## 🔄 Auto-Deploy

Every time you push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push
```

Railway automatically deploys! 🚀

---

## 🆘 Troubleshooting

### Build Failed
- Check Railway logs in **"Deployments"** tab
- Verify build command is correct
- Check if all dependencies are in `package.json`

### Telegram Not Working
- Verify environment variables in Railway
- Check if bot token and chat ID are correct
- Test with `/api/telegram/test` endpoint

### CORS Errors
- Add Railway URL to `allowedOrigins` in `backend/server.js`
- Push to GitHub (auto-deploys)

---

## 📊 Railway vs Render

| Feature | Railway | Render Free |
|---------|---------|-------------|
| **Sleeping** | No ❌ | Yes ✅ |
| **Free Credit** | $5/month | None |
| **Setup Time** | 5 min | 5 min |
| **Keep-Alive Needed** | No | Yes |
| **Auto-Deploy** | Yes | Yes |

**Railway is better for your use case!** 🏆

---

## 🎉 You're Live!

**Your URLs:**
- Frontend: `https://stocksignal.vercel.app`
- Backend: `https://stocksignal-backend.up.railway.app`

**Telegram messages work automatically 24/7!** 📱

---

**Questions?** Check Railway docs: https://docs.railway.app

**Happy Trading! 📈**
