# 📈 StockSignal - Real-Time Trading Signals Dashboard

A full-stack Progressive Web App (PWA) for real-time stock trading signals with automatic Telegram notifications.

![StockSignal](https://img.shields.io/badge/Status-Live-success)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![React](https://img.shields.io/badge/React-v18+-blue)

## ✨ Features

- 📊 **Real-time Trading Signals** - BUY/SELL/HOLD signals based on RSI and EMA indicators
- 📱 **Telegram Notifications** - Automatic signal alerts sent to your Telegram
- 🔄 **Background Sync** - Auto-refresh data even when app is closed (PWA)
- 📈 **Multiple Asset Types** - Stocks, Indices, Nifty50, NiftyNext50, Commodities, Crypto
- 💾 **Offline Support** - Works offline with cached data
- 🎯 **Technical Indicators** - RSI, EMA5, EMA10, EMA15, EMA20
- 📉 **52-Week High/Low** - Track yearly price ranges
- 📊 **Volume Analysis** - Monitor trading volumes
- 🔍 **Search & Filter** - Quick search and signal filtering
- ➕ **Watchlist Management** - Add/remove stocks dynamically

## 🚀 Tech Stack

### Frontend
- React 18
- Bootstrap 5
- Axios
- React Router
- Service Worker (PWA)

### Backend
- Node.js + Express
- Yahoo Finance API
- Telegram Bot API
- CORS enabled

## 📦 Installation

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Telegram Bot Token (get from @BotFather)
- Telegram Chat ID (get from @userinfobot)

### Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/StockSignal.git
cd StockSignal
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

Start backend:
```bash
node server.js
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

Visit: `http://localhost:3000`

## 🌐 Deployment

### Quick Deploy (5 minutes)

Follow the **[RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)** for step-by-step guide.

**Recommended Stack:**
- **Backend:** Railway.app (Free - $5 credit/month)
- **Frontend:** Vercel (Free)

**Total Cost: $0/month**

### Alternative Options

See **[DEPLOYMENT_FREE_ALTERNATIVES.md](DEPLOYMENT_FREE_ALTERNATIVES.md)** for other free platforms:
- Fly.io
- Cyclic.sh
- Vercel Serverless

## 📱 Telegram Setup

### 1. Create Telegram Bot
1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow instructions to create bot
4. Copy the bot token

### 2. Get Your Chat ID
1. Search for `@userinfobot` in Telegram
2. Start chat
3. Copy your Chat ID

### 3. Add to .env
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

### 4. Test
Visit: `http://localhost:5000/api/telegram/test`

Check Telegram for test message!

## 🎯 API Endpoints

### Signals
- `GET /api/signals/stocks` - Get stock signals
- `GET /api/signals/indices` - Get index signals
- `GET /api/signals/nifty50` - Get Nifty50 signals
- `GET /api/signals/niftynext50` - Get NiftyNext50 signals
- `GET /api/signals/commodities` - Get commodity signals
- `GET /api/signals/crypto` - Get crypto signals

### Watchlist Management
- `POST /api/:type` - Add symbol to watchlist
- `DELETE /api/:type/:symbol` - Remove symbol from watchlist

### Telegram
- `GET /api/telegram/test` - Send test message

### Health Check
- `GET /` - API status
- `GET /api/health` - Health check (for keep-alive)

## 📊 Technical Indicators

### RSI (Relative Strength Index)
- **< 30:** Oversold (potential BUY)
- **> 70:** Overbought (potential SELL)
- **30-70:** HOLD

### EMA (Exponential Moving Average)
- **EMA5 > EMA10:** Bullish trend
- **EMA5 < EMA10:** Bearish trend
- Multiple EMAs (5, 10, 15, 20) for trend confirmation

## 🔧 Configuration

### Backend Configuration
Edit `backend/server.js`:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-frontend-url.vercel.app'
];
```

### Frontend Configuration
Edit `frontend/src/services/api.js`:
```javascript
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
});
```

## 📁 Project Structure

```
StockSignal/
├── backend/
│   ├── data/
│   │   ├── stocks.json
│   │   ├── indices.json
│   │   ├── Nifty50.json
│   │   ├── niftynext50.json
│   │   ├── commodities.json
│   │   └── crypto.json
│   ├── services/
│   │   ├── stockService.js
│   │   ├── signalService.js
│   │   └── telegramService.js
│   ├── indicators/
│   │   └── indicators.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   ├── service-worker.js
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   └── Header/
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   ├── Options/
│   │   │   └── SymbolMaster/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── .github/
│   └── workflows/
│       └── telegram-cron.yml
├── nixpacks.toml
├── Procfile
├── railway.json
├── fly.toml
├── RAILWAY_DEPLOYMENT.md
├── RAILWAY_FIX.md
├── DEPLOYMENT_FREE_ALTERNATIVES.md
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Telegram not working
- Verify bot token and chat ID in `.env`
- Check backend logs for errors
- Test with `/api/telegram/test` endpoint

### CORS errors
- Add your frontend URL to `allowedOrigins` in `backend/server.js`
- Restart backend server

### Data not loading
- Check if backend is running
- Verify API URL in frontend
- Check browser console for errors

### Railway deployment issues
- Check `RAILWAY_FIX.md` for solutions
- Verify all environment variables are set
- Check Railway logs for errors

## 📞 Support

For issues and questions:
1. Check [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)
2. Check [DEPLOYMENT_FREE_ALTERNATIVES.md](DEPLOYMENT_FREE_ALTERNATIVES.md)
3. Review backend logs
4. Test API endpoints manually

## 🎉 Acknowledgments

- Yahoo Finance API for stock data
- Telegram Bot API for notifications
- Bootstrap for UI components
- React community for amazing tools

---

**Made with ❤️ for traders**

**Happy Trading! 📈**
