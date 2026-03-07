require('dotenv').config();
const express = require("express");
const cors = require("cors");
const fs = require('fs');
const path = require('path');
const getStockHistory = require("./services/stockService");
const generateSignal = require("./services/signalService");

const app = express();
const stocksPath = path.join(__dirname, './data/stocks.json');

const getStocks = () => JSON.parse(fs.readFileSync(stocksPath, 'utf8'));

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
    const stocks = getStocks();
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

app.post("/api/stocks", (req, res) => {
  const { symbol } = req.body;
  if (!symbol) {
    return res.status(400).json({ error: "Symbol is required" });
  }
  
  const stocks = getStocks();
  const exists = stocks.find(s => s.symbol === symbol.toUpperCase());
  if (exists) {
    return res.status(400).json({ error: "Stock already exists" });
  }
  
  stocks.push({ symbol: symbol.toUpperCase() });
  fs.writeFileSync(stocksPath, JSON.stringify(stocks, null, 2));
  res.json({ message: "Stock added successfully", symbol: symbol.toUpperCase() });
});

app.delete("/api/stocks/:symbol", (req, res) => {
  const { symbol } = req.params;
  const stocks = getStocks();
  const index = stocks.findIndex(s => s.symbol === symbol.toUpperCase());
  
  if (index === -1) {
    return res.status(404).json({ error: "Stock not found" });
  }
  
  stocks.splice(index, 1);
  fs.writeFileSync(stocksPath, JSON.stringify(stocks, null, 2));
  res.json({ message: "Stock deleted successfully" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});