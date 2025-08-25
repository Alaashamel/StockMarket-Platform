import { useState } from 'react'

const StockScreener = () => {
  const [filters, setFilters] = useState({
    marketCap: '',
    peRatio: '',
    sector: '',
    dividendYield: ''
  })

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 176.08, change: 1.24, marketCap: '2.7T', peRatio: 29.8, sector: 'Technology', dividendYield: '0.5%' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', price: 337.69, change: -0.56, marketCap: '2.5T', peRatio: 32.1, sector: 'Technology', dividendYield: '0.8%' },
        { symbol: 'JNJ', name: 'Johnson & Johnson', price: 152.34, change: 0.89, marketCap: '395B', peRatio: 25.4, sector: 'Healthcare', dividendYield: '2.9%' },
        { symbol: 'XOM', name: 'Exxon Mobil Corporation', price: 118.72, change: 2.31, marketCap: '475B', peRatio: 11.2, sector: 'Energy', dividendYield: '3.2%' },
        { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 168.32, change: 1.15, marketCap: '490B', peRatio: 11.8, sector: 'Financial Services', dividendYield: '2.5%' },
      ]
      setResults(mockResults)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Screener</h1>
        <p className="text-gray-600">Find stocks that match your investment criteria</p>
      </div>
      
      {/* Filters Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-5">Filter Stocks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Market Cap</label>
            <select
              name="marketCap"
              value={filters.marketCap}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any</option>
              <option value="large">Large Cap (&gt;$10B)</option>
              <option value="mid">Mid Cap ($2B-$10B)</option>
              <option value="small">Small Cap (&lt;$2B)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">P/E Ratio</label>
            <select
              name="peRatio"
              value={filters.peRatio}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any</option>
              <option value="low">Low (&lt;15)</option>
              <option value="medium">Medium (15-25)</option>
              <option value="high">High (&gt;25)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
            <select
              name="sector"
              value={filters.sector}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Energy">Energy</option>
              <option value="Consumer Cyclical">Consumer Cyclical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dividend Yield</label>
            <select
              name="dividendYield"
              value={filters.dividendYield}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Any</option>
              <option value="high">High (&gt;3%)</option>
              <option value="medium">Medium (1-3%)</option>
              <option value="low">Low (&lt;1%)</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Apply Filters
        </button>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P/E Ratio</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sector</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Div Yield</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((stock, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{stock.symbol}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{stock.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${stock.price.toFixed(2)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap font-medium ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{stock.marketCap}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{stock.peRatio}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {stock.sector}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-green-700">{stock.dividendYield}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No filters applied</h3>
          <p className="text-gray-500">Apply filters to see matching stocks</p>
        </div>
      )}
    </div>
  )
}

export default StockScreener