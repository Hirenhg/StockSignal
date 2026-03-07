require('dotenv').config();
const express = require("express");
const cors = require("cors");
const stocks = require("./data/stocks.json");
const getStockHistory = require("./services/stockService");
const generateSignal = require("./services/signalService");

const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Stock Signal API Running" });
});

app.get("/api/signals", async (req, res) => {
  try {
    const results = [];

    for (const stock of stocks) {
      try {
        // Fetch only 5min data
        const prices5m = await getStockHistory(stock.symbol, '5m', '1d');
        
        if (prices5m.length < 20) continue;

        const result = generateSignal(prices5m);
        
        // Fetch additional stock info
        const stockInfo = await getStockHistory(stock.symbol, '1d', '1y', true);
        
        results.push({
          symbol: stock.symbol,
          signal: result.signal,
          rsi: result.rsi.toFixed(2),
          ema5: result.ema5.toFixed(2),
          ema10: result.ema10.toFixed(2),
          ema15: result.ema15.toFixed(2),
          ema20: result.ema20.toFixed(2),
          price: prices5m[prices5m.length - 1].toFixed(2),
          week52High: stockInfo.week52High || null,
          week52Low: stockInfo.week52Low || null,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.error(`Error processing ${stock.symbol}:`, err.message);
      }
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch signals" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});