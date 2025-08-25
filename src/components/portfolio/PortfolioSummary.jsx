import usePortfolio from '../../hooks/usePortfolio'
import { formatCurrency, formatPercentage } from '../../utils/formatters'
import { calculateProfitLoss } from '../../utils/calculators'
import { useState } from 'react'

const PortfolioSummary = () => {
  const { portfolio, loading, error } = usePortfolio()
  const [expanded, setExpanded] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: 'value', direction: 'desc' })

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Portfolio Summary</h2>
          <div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error || !portfolio) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Portfolio Summary</h2>
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <div className="text-red-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">{error || 'No portfolio data available'}</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Sort stocks
  const sortedStocks = [...portfolio.stocks].sort((a, b) => {
    if (sortConfig.key === 'symbol') {
      return sortConfig.direction === 'asc' 
        ? a.symbol.localeCompare(b.symbol) 
        : b.symbol.localeCompare(a.symbol)
    } else if (sortConfig.key === 'value') {
      return sortConfig.direction === 'asc' 
        ? a.value - b.value 
        : b.value - a.value
    } else if (sortConfig.key === 'profitLoss') {
      const aPL = calculateProfitLoss(a.currentPrice, a.avgPrice, a.shares).profitLoss
      const bPL = calculateProfitLoss(b.currentPrice, b.avgPrice, b.shares).profitLoss
      return sortConfig.direction === 'asc' ? aPL - bPL : bPL - aPL
    }
    return 0
  })

  // Calculate totals
  const totalGainLoss = portfolio.stocks.reduce((total, stock) => {
    const { profitLoss } = calculateProfitLoss(stock.currentPrice, stock.avgPrice, stock.shares)
    return total + profitLoss
  }, 0)

  const totalGainLossPercent = portfolio.totalValue > 0 
    ? (totalGainLoss / (portfolio.totalValue - totalGainLoss)) * 100 
    : 0

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800">Portfolio Summary</h2>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {expanded ? 'Show Less' : 'Show Details'}
          </button>
        </div>
        <p className="text-gray-600">As of {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-600 text-sm font-medium mb-1">Total Value</div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(portfolio.totalValue)}</div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-600 text-sm font-medium mb-1">Daily Change</div>
          <div className={`text-2xl font-bold ${portfolio.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {portfolio.dailyChange >= 0 ? '+' : ''}{formatCurrency(portfolio.dailyChange)}
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-600 text-sm font-medium mb-1">Daily % Change</div>
          <div className={`text-2xl font-bold ${portfolio.dailyChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {portfolio.dailyChangePercent >= 0 ? '+' : ''}{portfolio.dailyChangePercent.toFixed(2)}%
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-600 text-sm font-medium mb-1">Total Gain/Loss</div>
          <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)}
          </div>
          <div className={`text-sm ${totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {expanded && (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Holdings</h3>
            <div className="text-sm text-gray-500">
              {portfolio.stocks.length} holding{portfolio.stocks.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('symbol')}
                  >
                    <div className="flex items-center">
                      Stock
                      {sortConfig.key === 'symbol' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 ${sortConfig.direction === 'asc' ? '' : 'transform rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('value')}
                  >
                    <div className="flex items-center">
                      Value
                      {sortConfig.key === 'value' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 ${sortConfig.direction === 'asc' ? '' : 'transform rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('profitLoss')}
                  >
                    <div className="flex items-center">
                      P/L
                      {sortConfig.key === 'profitLoss' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 ${sortConfig.direction === 'asc' ? '' : 'transform rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedStocks.map((stock, index) => {
                  const { profitLoss, profitLossPercent } = calculateProfitLoss(stock.currentPrice, stock.avgPrice, stock.shares)
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{stock.symbol}</td>
                      <td className="px-6 py-4">{stock.shares.toLocaleString()}</td>
                      <td className="px-6 py-4">{formatCurrency(stock.avgPrice)}</td>
                      <td className="px-6 py-4">{formatCurrency(stock.currentPrice)}</td>
                      <td className="px-6 py-4 font-medium">{formatCurrency(stock.value)}</td>
                      <td className={`px-6 py-4 font-medium ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <div>{profitLoss >= 0 ? '+' : ''}{formatCurrency(profitLoss)}</div>
                        <div className="text-sm">{profitLossPercent >= 0 ? '+' : ''}{profitLossPercent.toFixed(2)}%</div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default PortfolioSummary