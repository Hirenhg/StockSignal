process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

require('dotenv').config();
const express = require("express");
const cors = require("cors");
const fs = require('fs');
const path = require('path');
const getStockHistory = require("./services/stockService");
const generateSignal = require("./services/signalService");
const { initializeWebSocket, getLivePrice } = require("./services/angelWebSocket");

// Initialize Angel One WebSocket
initializeWebSocket();

const app = express();
const stocksPath = path.join(__dirname, './data/stocks.json');
const indicesPath = path.join(__dirname, './data/indices.json');
const optionsPath = path.join(__dirname, './data/options.json');
const commoditiesPath = path.join(__dirname, './data/commodities.json');
const cryptoPath = path.join(__dirname, './data/crypto.json');

const getStocks = () => JSON.parse(fs.readFileSync(stocksPath, 'utf8'));
const getIndices = () => JSON.parse(fs.readFileSync(indicesPath, 'utf8'));
const getOptions = () => JSON.parse(fs.readFileSync(optionsPath, 'utf8'));
const getCommodities = () => JSON.parse(fs.readFileSync(commoditiesPath, 'utf8'));
const getCrypto = () => JSON.parse(fs.readFileSync(cryptoPath, 'utf8'));

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

app.get("/api/signals/:type", async (req, res) => {
  try {
    const type = req.params.type || 'stocks';
    let stocks = [];
    
    switch(type) {
      case 'indices':
        stocks = getIndices();
        break;
      case 'commodities':
        stocks = getCommodities();
        break;
      case 'crypto':
        stocks = getCrypto();
        break;
      default:
        stocks = getStocks();
    }
    
    const results = [];

    for (const stock of stocks) {
      try {
        const prices5m = await getStockHistory(stock.symbol, '1d', '3mo');
        
        if (!prices5m || prices5m.length < 20) continue;

        const result = generateSignal(prices5m);
        
        let stockInfo = { week52High: null, week52Low: null };
        let volumeData = null;
        
        try {
          stockInfo = await getStockHistory(stock.symbol, '1d', '1y', true);
          volumeData = await getStockHistory(stock.symbol, '1d', '1y', false, true);
        } catch (err) {}
        
        // Get yesterday's high and low
        let yesterdayHigh = null;
        let yesterdayLow = null;
        try {
          const yesterdayData = await getStockHistory(stock.symbol, '1d', '5d', false, false, true);
          if (yesterdayData) {
            yesterdayHigh = yesterdayData.high;
            yesterdayLow = yesterdayData.low;
          }
        } catch (err) {}
        
        results.push({
          symbol: stock.symbol,
          signal: result.signal,
          rsi: result.rsi.toFixed(2),
          ema5: result.ema5.toFixed(2),
          ema10: result.ema10.toFixed(2),
          ema15: result.ema15.toFixed(2),
          ema20: result.ema20.toFixed(2),
          price: prices5m[prices5m.length - 1].toFixed(2),
          week52High: stockInfo?.week52High || null,
          week52Low: stockInfo?.week52Low || null,
          volume: volumeData || null,
          yesterdayHigh: yesterdayHigh,
          yesterdayLow: yesterdayLow,
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

app.post("/api/:type", (req, res) => {
  const { type } = req.params;
  const { symbol } = req.body;
  if (!symbol) {
    return res.status(400).json({ error: "Symbol is required" });
  }
  
  let data, filePath;
  switch(type) {
    case 'stocks':
      data = getStocks();
      filePath = stocksPath;
      break;
    case 'indices':
      data = getIndices();
      filePath = indicesPath;
      break;
    case 'commodities':
      data = getCommodities();
      filePath = commoditiesPath;
      break;
    case 'crypto':
      data = getCrypto();
      filePath = cryptoPath;
      break;
    default:
      return res.status(400).json({ error: "Invalid type" });
  }
  
  const exists = data.find(s => s.symbol === symbol.toUpperCase());
  if (exists) {
    return res.status(400).json({ error: `${type.slice(0, -1)} already exists` });
  }
  
  data.push({ symbol: symbol.toUpperCase() });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ message: `${type.slice(0, -1)} added successfully`, symbol: symbol.toUpperCase() });
});

app.delete("/api/:type/:symbol", (req, res) => {
  const { type, symbol } = req.params;
  
  let data, filePath;
  switch(type) {
    case 'stocks':
      data = getStocks();
      filePath = stocksPath;
      break;
    case 'indices':
      data = getIndices();
      filePath = indicesPath;
      break;
    case 'commodities':
      data = getCommodities();
      filePath = commoditiesPath;
      break;
    case 'crypto':
      data = getCrypto();
      filePath = cryptoPath;
      break;
    default:
      return res.status(400).json({ error: "Invalid type" });
  }
  
  const index = data.findIndex(s => s.symbol === symbol.toUpperCase());
  
  if (index === -1) {
    return res.status(404).json({ error: `${type.slice(0, -1)} not found` });
  }
  
  data.splice(index, 1);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ message: `${type.slice(0, -1)} deleted successfully` });
});

app.get("/api/options/data", (req, res) => {
  const options = getOptions();
  res.json(options);
});

app.get("/api/symbol-master", async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, './data/OpenAPIScripMaster.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to load symbol master data" });
  }
});

app.get("/api/options/refresh", async (req, res) => {
  res.json({ message: "Options data refreshed", count: 0 });
});

app.get("/api/options/live", (req, res) => {
  res.json([]);
});

app.post("/api/options", (req, res) => {
  const { symbol, expiry, strikePrice, optionType } = req.body;
  if (!symbol || !strikePrice || !optionType) {
    return res.status(400).json({ error: "Symbol, strikePrice, and optionType are required" });
  }
  
  const options = getOptions();
  const exists = options.find(o => o.symbol === symbol.toUpperCase() && o.strikePrice === strikePrice && o.optionType === optionType);
  if (exists) {
    return res.status(400).json({ error: "Option already exists" });
  }
  
  options.push({ symbol: symbol.toUpperCase(), expiry: expiry || null, strikePrice, optionType });
  fs.writeFileSync(optionsPath, JSON.stringify(options, null, 2));
  res.json({ message: "Option added successfully" });
});

app.delete("/api/options/:symbol", (req, res) => {
  const { symbol } = req.params;
  const options = getOptions();
  const index = options.findIndex(o => o.symbol === symbol.toUpperCase());
  
  if (index === -1) {
    return res.status(404).json({ error: "Option not found" });
  }
  
  options.splice(index, 1);
  fs.writeFileSync(optionsPath, JSON.stringify(options, null, 2));
  res.json({ message: "Option deleted successfully" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});