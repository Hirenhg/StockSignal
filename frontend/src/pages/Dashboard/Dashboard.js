import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import API from "../../services/api"

function Dashboard() {
  const [signals, setSignals] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [searchTerm, setSearchTerm] = useState('')
  const [newStock, setNewStock] = useState('')

  const filteredSignals = signals.filter(s => 
    s.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const buyCount = filteredSignals.filter(s => s.signal === 'BUY').length
  const sellCount = filteredSignals.filter(s => s.signal === 'SELL').length
  const holdCount = filteredSignals.filter(s => s.signal === 'HOLD').length

  useEffect(() => {
    fetchSignals()
  }, [])

  const fetchSignals = () => {
    API.get("/api/signals")
      .then(res => {
        setSignals(res.data)
      })
      .catch(err => console.error("API Error:", err))
  }

  const handleAddStock = () => {
    if (!newStock.trim()) return
    API.post("/api/stocks", { symbol: newStock })
      .then(() => {
        setNewStock('')
        alert('Stock added successfully!')
        fetchSignals()
      })
      .catch(err => alert(err.response?.data?.error || 'Error adding stock'))
  }

  const handleDeleteStock = (symbol) => {
    if (!window.confirm(`Delete ${symbol}?`)) return
    API.delete(`/api/stocks/${symbol}`)
      .then(() => {
        setSignals(signals.filter(s => s.symbol !== symbol))
        alert('Stock deleted successfully!')
      })
      .catch(err => {
        console.error('Delete error:', err)
        alert(err.response?.data?.error || 'Error deleting stock')
      })
  }

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })

    const sorted = [...filteredSignals].sort((a, b) => {
      if (key === 'signal' || key === 'symbol') {
        return direction === 'asc' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key])
      }
      return direction === 'asc' ? parseFloat(a[key]) - parseFloat(b[key]) : parseFloat(b[key]) - parseFloat(a[key])
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
        
        <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
         <input 
              type="text" 
              className="form-control" 
              placeholder="Search Stock" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          <div className="d-flex gap-3">
            <span className="badge bg-success fs-6">BUY: {buyCount}</span>
            <span className="badge bg-danger fs-6">SELL: {sellCount}</span>
            <span className="badge bg-secondary fs-6">HOLD: {holdCount}</span>
          </div>
          </div>
          <div className="d-flex gap-2">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Add stock" 
              value={newStock}
              onChange={(e) => setNewStock(e.target.value.toUpperCase())}
            />
            <button className="btn btn-primary" onClick={handleAddStock}>Add</button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th onClick={() => handleSort('symbol')} style={{cursor: 'pointer'}}>
                  Stock {sortConfig.key === 'symbol' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('price')} style={{cursor: 'pointer'}}>
                  Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
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
                <th>52W High</th>
                <th>52W Low</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSignals.map((item,index)=>(
                <tr key={index}>
                  <td className="fw-bold">{item.symbol}</td>
                  <td>₹{item.price}</td>
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
                  <td>₹{item.week52High || '-'}</td>
                  <td>₹{item.week52Low || '-'}</td>
                  <td>{new Date(item.timestamp).toLocaleString()}</td>
                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => handleDeleteStock(item.symbol)} title="Delete">
                      Delete
                    </button>
                  </td>
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