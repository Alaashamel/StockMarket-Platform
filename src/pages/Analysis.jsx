import { useState, useEffect } from 'react'

const Analysis = () => {
  const [activeTab, setActiveTab] = useState('technical')
  const [isLoading, setIsLoading] = useState(false)
  const [tabContent, setTabContent] = useState({
    technical: null,
    fundamental: null,
    screener: null
  })

  // Simulate loading content for each tab
  useEffect(() => {
    const loadTabContent = async (tab) => {
      setIsLoading(true)
      
      // Simulate API call or data loading delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setTabContent(prev => ({
        ...prev,
        [tab]: renderTabContent(tab)
      }))
      
      setIsLoading(false)
    }

    if (!tabContent[activeTab]) {
      loadTabContent(activeTab)
    }
  }, [activeTab, tabContent])

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setIsLoading(true)
      setActiveTab(tab)
      
      // If content for this tab hasn't been loaded yet, it will trigger the useEffect
      if (tabContent[tab]) {
        // If content is already loaded, just show it after a small delay for smooth transition
        setTimeout(() => setIsLoading(false), 300)
      }
    }
  }

  const renderTabContent = (tab) => {
    switch (tab) {
      case 'technical':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Technical Analysis Tools</h3>
              <span className="text-sm text-gray-500">Real-time data</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-xl p-5 text-center hover:shadow-md transition-shadow cursor-pointer group">
                <div className="text-blue-600 mb-3 group-hover:text-blue-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Advanced Charting</h4>
                <p className="text-sm text-gray-600">Interactive charts with drawing tools and multiple timeframes</p>
                <div className="mt-3 text-xs text-blue-600 font-medium">Explore →</div>
              </div>
              <div className="border border-gray-200 rounded-xl p-5 text-center hover:shadow-md transition-shadow cursor-pointer group">
                <div className="text-blue-600 mb-3 group-hover:text-blue-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Technical Indicators</h4>
                <p className="text-sm text-gray-600">50+ indicators including RSI, MACD, Bollinger Bands</p>
                <div className="mt-3 text-xs text-blue-600 font-medium">Explore →</div>
              </div>
              <div className="border border-gray-200 rounded-xl p-5 text-center hover:shadow-md transition-shadow cursor-pointer group">
                <div className="text-blue-600 mb-3 group-hover:text-blue-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Pattern Recognition</h4>
                <p className="text-sm text-gray-600">AI-powered pattern detection and backtesting</p>
                <div className="mt-3 text-xs text-blue-600 font-medium">Explore →</div>
              </div>
            </div>
          </div>
        )
      case 'fundamental':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Fundamental Analysis</h3>
              <span className="text-sm text-gray-500">Comprehensive financial data</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Financial Statements
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h5 className="font-medium text-sm mb-2 text-gray-700">Income Statement</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>Revenue & Growth</li>
                      <li>Profit Margins</li>
                      <li>EPS Analysis</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h5 className="font-medium text-sm mb-2 text-gray-700">Balance Sheet</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>Assets & Liabilities</li>
                      <li>Debt Analysis</li>
                      <li>Equity Structure</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h5 className="font-medium text-sm mb-2 text-gray-700">Cash Flow</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>Operating Activities</li>
                      <li>Investing Activities</li>
                      <li>Financing Activities</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h5 className="font-medium text-sm mb-2 text-gray-700">Ratios & Metrics</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>Liquidity Ratios</li>
                      <li>Profitability Ratios</li>
                      <li>Efficiency Ratios</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Valuation Metrics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h5 className="font-medium text-sm mb-2 text-gray-700">Price Ratios</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>P/E Ratio</li>
                      <li>P/B Ratio</li>
                      <li>P/S Ratio</li>
                      <li>P/FCF Ratio</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h5 className="font-medium text-sm mb-2 text-gray-700">Enterprise Value</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>EV/EBITDA</li>
                      <li>EV/Revenue</li>
                      <li>EV/FCF</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h5 className="font-medium text-sm mb-2 text-gray-700">Dividend Analysis</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>Dividend Yield</li>
                      <li>Payout Ratio</li>
                      <li>Dividend Growth</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h5 className="font-medium text-sm mb-2 text-gray-700">Analyst Estimates</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>Price Targets</li>
                      <li>EPS Estimates</li>
                      <li>Recommendations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'screener':
        return (
          <div className="text-center py-8">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="text-purple-600 mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Advanced Stock Screener</h3>
              <p className="text-gray-600 mb-6">Filter stocks based on 100+ fundamental and technical criteria to find perfect investment opportunities.</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-left">
                  <h4 className="font-medium text-gray-800 mb-2">✓ Fundamental Filters</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Valuation Metrics</li>
                    <li>Financial Ratios</li>
                    <li>Growth Rates</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-800 mb-2">✓ Technical Filters</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Price Patterns</li>
                    <li>Indicator Values</li>
                    <li>Volume Analysis</li>
                  </ul>
                </div>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
                Launch Advanced Screener
              </button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-800">Analysis Tools</h1>
        <p className="text-gray-600 text-sm mt-1 sm:mt-0">Advanced analytics for informed investment decisions</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => handleTabChange('technical')}
              disabled={isLoading}
              className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-all duration-200 ${
                activeTab === 'technical'
                  ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <span>Technical Analysis</span>
                {isLoading && activeTab === 'technical' && (
                  <div className="ml-1 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                )}
              </div>
            </button>
            <button
              onClick={() => handleTabChange('fundamental')}
              disabled={isLoading}
              className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-all duration-200 ${
                activeTab === 'fundamental'
                  ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Fundamental Analysis</span>
                {isLoading && activeTab === 'fundamental' && (
                  <div className="ml-1 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                )}
              </div>
            </button>
            <button
              onClick={() => handleTabChange('screener')}
              disabled={isLoading}
              className={`py-4 px-6 text-center font-medium text-sm border-b-2 transition-all duration-200 ${
                activeTab === 'screener'
                  ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Advanced Screener</span>
                {isLoading && activeTab === 'screener' && (
                  <div className="ml-1 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                )}
              </div>
            </button>
          </nav>
        </div>
        
        <div className="p-6 min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading analysis tools...</p>
              </div>
            </div>
          ) : (
            tabContent[activeTab]
          )}
        </div>
      </div>
    </div>
  )
}

export default Analysis