import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import API from "../../services/api"

function Dashboard() {
  const [signals, setSignals] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const buyCount = signals.filter(s => s.signal === 'BUY').length
  const sellCount = signals.filter(s => s.signal === 'SELL').length
  const holdCount = signals.filter(s => s.signal === 'HOLD').length

  useEffect(() => {
    API.get("/api/signals")
      .then(res => {
        setSignals(res.data)
      })
      .catch(err => console.error("API Error:", err))
  }, [])

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })

    const sorted = [...signals].sort((a, b) => {
      if (key === 'signal') {
        return direction === 'asc' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key])
      }
      return direction === 'asc' ? a[key] - b[key] : b[key] - a[key]
    })
    setSignals(sorted)
  }

  return (
    <>
      <Helmet>
        <title>Stock Signals Dashboard</title>
      </Helmet>
      
      <div className="p-4">
        <h2 className="mb-4">Trading Signals</h2>
        
        <div className="d-flex gap-3 mb-3">
          <span className="badge bg-success fs-6">BUY: {buyCount}</span>
          <span className="badge bg-danger fs-6">SELL: {sellCount}</span>
          <span className="badge bg-secondary fs-6">HOLD: {holdCount}</span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>Stock</th>
                <th>Price</th>
                <th>PE</th>
                <th>52W High</th>
                <th>52W Low</th>
                <th>Promoter %</th>
                <th onClick={() => handleSort('signal')} style={{cursor: 'pointer'}}>
                  Signal {sortConfig.key === 'signal' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('rsi')} style={{cursor: 'pointer'}}>
                  RSI {sortConfig.key === 'rsi' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{color: 'red'}}>EMA5</th>
                <th style={{color: 'green'}}>EMA10</th>
                <th style={{color: 'blue'}}>EMA15</th>
                <th style={{color: '#ffc107'}}>EMA20</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {signals.map((item,index)=>(
                <tr key={index}>
                  <td className="fw-bold">{item.symbol}</td>
                  <td>₹{item.price}</td>
                  <td>{item.pe || '-'}</td>
                  <td>₹{item.week52High || '-'}</td>
                  <td>₹{item.week52Low || '-'}</td>
                  <td>{item.promoter ? `${item.promoter}%` : '-'}</td>
                  <td>
                    <span className={`badge ${item.signal === "BUY" ? "bg-success" : item.signal === "SELL" ? "bg-danger" : "bg-secondary"}`}>
                      {item.signal}
                    </span>
                  </td>
                  <td>{item.rsi}</td>
                  <td style={{color: 'red'}}>₹{item.ema5}</td>
                  <td style={{color: 'green'}}>₹{item.ema10}</td>
                  <td style={{color: 'blue'}}>₹{item.ema15}</td>
                  <td style={{color: '#ffc107'}}>₹{item.ema20}</td>
                  <td>{new Date(item.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Dashboard