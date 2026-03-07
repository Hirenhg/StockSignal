const axios = require("axios");

const ALLOWED_SYMBOLS = [
  "RELIANCE",
  "TCS",
  "INFY",
  "HDFCBANK",
  "ICICIBANK",
  "HINDUNILVR",
  "ITC",
  "SBIN",
  "BHARTIARTL",
  "KOTAKBANK",
  "LT",
  "AXISBANK",
  "ASIANPAINT",
  "MARUTI",
  "HCLTECH",
  "SUNPHARMA",
  "BAJFINANCE",
  "TITAN",
  "WIPRO",
  "ULTRACEMCO",
  "NESTLEIND",
  "ONGC",
  "NTPC",
  "POWERGRID",
  "M&M",
  "TATASTEEL",
  "TECHM",
  "ADANIPORTS",
  "COALINDIA",
  "BAJAJFINSV",
  "DRREDDY",
  "JSWSTEEL",
  "INDUSINDBK",
  "DIVISLAB",
  "GRASIM",
  "CIPLA",
  "EICHERMOT",
  "HEROMOTOCO",
  "BRITANNIA",
  "SHREECEM",
  "HINDALCO",
  "BPCL",
  "APOLLOHOSP",
  "ADANIENT",
  "TATACONSUM",
  "UPL",
  "BAJAJ-AUTO",
  "SBILIFE",
  "HDFCLIFE",
];

async function getStockHistory(symbol, interval = '1m', range = '1d', getInfo = false) {
  if (!ALLOWED_SYMBOLS.includes(symbol.toUpperCase())) {
    throw new Error(`Invalid symbol: ${symbol}`);
  }

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?range=${range}&interval=${interval}`;
  const response = await axios.get(url, { timeout: 5000 });
  
  if (getInfo) {
    const meta = response.data.chart.result[0].meta;
    const prices = response.data.chart.result[0].indicators.quote[0].close.filter(p => p !== null);
    return {
      week52High: meta.fiftyTwoWeekHigh || null,
      week52Low: meta.fiftyTwoWeekLow || null
    };
  }
  
  const prices = response.data.chart.result[0].indicators.quote[0].close;
  return prices.filter((p) => p !== null);
}

module.exports = getStockHistory;
