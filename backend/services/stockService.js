const axios = require("axios");

async function getStockHistory(symbol, interval = '1m', range = '1d', getInfo = false) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`;
  const response = await axios.get(url, { timeout: 5000 });
  
  if (getInfo) {
    const meta = response.data.chart.result[0].meta;
    return {
      week52High: meta.fiftyTwoWeekHigh ? meta.fiftyTwoWeekHigh.toFixed(2) : null,
      week52Low: meta.fiftyTwoWeekLow ? meta.fiftyTwoWeekLow.toFixed(2) : null
    };
  }
  
  const prices = response.data.chart.result[0].indicators.quote[0].close;
  return prices.filter((p) => p !== null);
}

module.exports = getStockHistory;
