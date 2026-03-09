const axios = require("axios");

async function getStockHistory(symbol, interval = '1m', range = '1d', getInfo = false, getVolume = false) {
  // Don't add .NS for indices, crypto, commodities, or forex
  const skipNS = symbol.startsWith('^') || symbol.includes('-') || symbol.includes('=');
  const fullSymbol = skipNS ? symbol : `${symbol}.NS`;
  
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${fullSymbol}?range=${range}&interval=${interval}`;
  const response = await axios.get(url, { timeout: 5000 });
  
  if (getInfo) {
    const meta = response.data.chart.result[0].meta;
    return {
      week52High: meta.fiftyTwoWeekHigh ? meta.fiftyTwoWeekHigh.toFixed(2) : null,
      week52Low: meta.fiftyTwoWeekLow ? meta.fiftyTwoWeekLow.toFixed(2) : null
    };
  }
  
  if (getVolume) {
    const volumes = response.data.chart.result[0].indicators.quote[0].volume;
    if (!volumes) return null;
    const latestVolume = volumes.filter(v => v !== null && v !== undefined).pop();
    if (!latestVolume) return null;
    // Return in thousands (K)
    return latestVolume >= 1000 ? (latestVolume / 1000).toFixed(0) : latestVolume.toFixed(0);
  }
  
  const prices = response.data.chart.result[0].indicators.quote[0].close;
  return prices.filter((p) => p !== null);
}

module.exports = getStockHistory;
