import { useState } from 'react'
import MarketOverview from '../components/market/MarketOverview'
import StockScreener from '../components/market/StockScreener'
import RealTimeChart from '../components/charts/RealTimeChart'
import TechnicalIndicator from '../components/charts/TechnicalIndicator'
import PortfolioPerformance from '../components/portfolio/PerformanceAnalytics'
import SectorPerformance from '../components/market/SectorPerformance'

const Market = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedStock, setSelectedStock] = useState('AAPL')
  const [selectedCompany, setSelectedCompany] = useState('All Companies')
  const [timeRange, setTimeRange] = useState('1D')

  // Sample company data
  const companies = [
    {
      id: 'aapl',
      name: 'Apple Inc.',
      symbol: 'AAPL',
      sector: 'Technology',
      description: 'Consumer electronics, software, and online services',
      marketCap: 2800.08,
      volume: 75.0,
      price: 175.25,
      performance: '+2.8%'
    },
    {
      id: 'msft',
      name: 'Microsoft Corporation',
      symbol: 'MSFT',
      sector: 'Technology',
      description: 'Software, cloud computing, and hardware',
      marketCap: 2200.08,
      volume: 45.0,
      price: 345.87,
      performance: '+1.9%'
    },
    {
      id: 'jnj',
      name: 'Johnson & Johnson',
      symbol: 'JNJ',
      sector: 'Healthcare',
      description: 'Pharmaceuticals, medical devices, and consumer packaged goods',
      marketCap: 450.25,
      volume: 15.2,
      price: 165.34,
      performance: '+0.7%'
    },
    {
      id: 'jpm',
      name: 'JPMorgan Chase & Co.',
      symbol: 'JPM',
      sector: 'Financial Services',
      description: 'Banking and financial services',
      marketCap: 480.75,
      volume: 25.8,
      price: 145.67,
      performance: '-1.2%'
    },
    {
      id: 'xom',
      name: 'Exxon Mobil Corporation',
      symbol: 'XOM',
      sector: 'Energy',
      description: 'Oil and gas exploration and production',
      marketCap: 520.45,
      volume: 35.4,
      price: 105.23,
      performance: '+3.5%'
    },
    {
      id: 'amzn',
      name: 'Amazon.com Inc.',
      symbol: 'AMZN',
      sector: 'Consumer Cyclical',
      description: 'E-commerce, cloud computing, digital streaming',
      marketCap: 1650.89,
      volume: 65.3,
      price: 2850.75,
      performance: '+1.2%'
    }
  ]

  const tabs = [
    {
      id: 'overview',
      label: 'Market Overview',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'screener',
      label: 'Stock Screener',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      )
    },
    {
      id: 'charts',
      label: 'Charts & Analysis',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
    {
      id: 'sectors',
      label: 'Sector Performance',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    }
    // Watchlist tab has been removed
  ]

  const timeRanges = ['1D', '1W', '1M', '3M']

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Market</h1>
          <p className="text-gray-600 mt-1">Real-time market data and analysis tools</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
            Live Market Data
          </div>
        </div>
      </div>
      
      {/* Company Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Company Performance</h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Company</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="All Companies">All Companies</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name} ({company.symbol})
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <div className="flex space-x-2">
              {timeRanges.map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    timeRange === range
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Company Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies
            .filter(company => selectedCompany === "All Companies" || company.id === selectedCompany)
            .map(company => (
              <div key={company.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{company.name}</h3>
                    <p className="text-sm text-gray-600">{company.symbol} • {company.sector}</p>
                  </div>
                  <span className={`text-sm font-medium ${company.performance.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {company.performance}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">{company.description}</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Market Cap</p>
                    <p className="font-semibold text-sm">${company.marketCap}B</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Volume</p>
                    <p className="font-semibold text-sm">{company.volume}M</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="font-semibold text-sm">${company.price}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedStock(company.symbol)}
                  className="mt-3 w-full py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium rounded-md transition-colors"
                >
                  View Details
                </button>
              </div>
            ))}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 text-center font-medium text-sm border-b-2 flex items-center transition-colors duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <MarketOverview onSelectStock={setSelectedStock} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PortfolioPerformance />
                <SectorPerformance />
              </div>
            </div>
          )}
          
          {activeTab === 'screener' && <StockScreener />}
          
          {activeTab === 'charts' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RealTimeChart symbol={selectedStock} />
                <TechnicalIndicator symbol={selectedStock} />
              </div>
            </div>
          )}
          
          {activeTab === 'sectors' && <SectorPerformance detailed={true} />}
        </div>
      </div>
    </div>
  )
}

export default Market