import { useState, useEffect, useRef, useCallback } from 'react'

const RealTimeChart = ({ initialSymbol = 'AAPL', timeFrame = '1D', height = 320 }) => {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeFrames] = useState(['1D', '1W', '1M', '3M', '1Y', 'All'])
  const [activeTimeFrame, setActiveTimeFrame] = useState(timeFrame)
  const [priceInfo, setPriceInfo] = useState({ current: 0, change: 0, changePercent: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [hoverData, setHoverData] = useState(null)
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol)
  const canvasRef = useRef(null)

  // Available companies for analysis
  const companies = [
    { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 150 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', basePrice: 300 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', basePrice: 130 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', basePrice: 130 },
    { symbol: 'TSLA', name: 'Tesla Inc.', basePrice: 200 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', basePrice: 400 },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', basePrice: 150 },
    { symbol: 'JNJ', name: 'Johnson & Johnson', basePrice: 150 },
    { symbol: 'XOM', name: 'Exxon Mobil Corporation', basePrice: 100 },
    { symbol: 'BTC-USD', name: 'Bitcoin USD', basePrice: 50000 },
  ]

  // Generate mock data based on time frame and company
  const generateMockData = useCallback(() => {
    const data = []
    const company = companies.find(c => c.symbol === selectedSymbol)
    let baseValue = company ? company.basePrice + (Math.random() - 0.5) * 20 : 150
    
    const points = {
      '1D': 78,    // 6.5 hours of trading (78 * 5min intervals)
      '1W': 35,    // 7 days
      '1M': 22,    // 22 trading days
      '3M': 66,    // ~66 trading days
      '1Y': 252,   // 252 trading days
      'All': 500   // 500 data points
    }

    const volatility = {
      '1D': 0.8,
      '1W': 1.2,
      '1M': 1.5,
      '3M': 2.0,
      '1Y': 2.5,
      'All': 3.0
    }

    const pointsCount = points[activeTimeFrame] || 78
    const vol = volatility[activeTimeFrame] || 1.0

    for (let i = 0; i < pointsCount; i++) {
      // Add some trend based on time frame
      const trend = activeTimeFrame === '1D' ? 0 : (i / pointsCount) * vol * 2
      const randomWalk = (Math.random() - 0.5) * vol * 3
      baseValue = baseValue + randomWalk + trend
      data.push(baseValue)
    }
    return data
  }, [activeTimeFrame, selectedSymbol, companies])

  // Initialize and update chart data
  useEffect(() => {
    setLoading(true)
    const mockData = generateMockData()
    setChartData(mockData)
    
    // Calculate price info
    const current = mockData[mockData.length - 1]
    const previous = mockData[0]
    const change = current - previous
    const changePercent = (change / previous) * 100
    
    setPriceInfo({
      current,
      change,
      changePercent
    })
    
    setLoading(false)

    // Simulate real-time updates - CHANGED FROM 2000ms TO 5000ms
    const interval = setInterval(() => {
      setChartData(prevData => {
        if (prevData.length === 0) return prevData
        
        const lastValue = prevData[prevData.length - 1]
        const newValue = lastValue + (Math.random() - 0.5) * 1.5 // Smaller real-time fluctuations
        
        const updatedData = [...prevData.slice(1), newValue]
        
        // Update price info
        const current = newValue
        const previous = updatedData[0]
        const change = current - previous
        const changePercent = (change / previous) * 100
        
        setPriceInfo({
          current,
          change,
          changePercent
        })
        
        return updatedData
      })
    }, 2000) // CHANGED FROM 2000ms TO 5000ms (5 seconds)

    return () => clearInterval(interval)
  }, [selectedSymbol, activeTimeFrame, generateMockData])

  // Draw chart
  useEffect(() => {
    if (!canvasRef.current || chartData.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    const padding = { top: 20, right: 20, bottom: 30, left: 50 }

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Calculate min and max values with some padding
    const min = Math.min(...chartData) * 0.995
    const max = Math.max(...chartData) * 1.005
    const range = max - min

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 3])
    
    // Horizontal grid lines
    const horizontalLines = 5
    for (let i = 0; i <= horizontalLines; i++) {
      const y = padding.top + (height - padding.top - padding.bottom) * (i / horizontalLines)
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()
      
      // Price labels
      ctx.setLineDash([])
      ctx.fillStyle = '#6b7280'
      ctx.font = '10px Inter'
      ctx.textAlign = 'right'
      const price = max - (range * (i / horizontalLines))
      ctx.fillText(price.toFixed(2), padding.left - 5, y + 3)
    }

    ctx.setLineDash([5, 3])
    
    // Vertical grid lines (time markers)
    const verticalLines = 4
    for (let i = 0; i <= verticalLines; i++) {
      const x = padding.left + (width - padding.left - padding.right) * (i / verticalLines)
      ctx.beginPath()
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, height - padding.bottom)
      ctx.stroke()
    }

    // Draw chart area
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.lineWidth = 2.5
    ctx.strokeStyle = priceInfo.change >= 0 ? '#10b981' : '#ef4444'

    // Draw main chart line
    chartData.forEach((value, index) => {
      const x = padding.left + (index / (chartData.length - 1)) * (width - padding.left - padding.right)
      const y = padding.top + (height - padding.top - padding.bottom) - ((value - min) / range) * (height - padding.top - padding.bottom)

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw filled area under line
    ctx.fillStyle = priceInfo.change >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top + (height - padding.top - padding.bottom))
    chartData.forEach((value, index) => {
      const x = padding.left + (index / (chartData.length - 1)) * (width - padding.left - padding.right)
      const y = padding.top + (height - padding.top - padding.bottom) - ((value - min) / range) * (height - padding.top - padding.bottom)
      ctx.lineTo(x, y)
    })
    ctx.lineTo(width - padding.right, padding.top + (height - padding.top - padding.bottom))
    ctx.closePath()
    ctx.fill()

    // Draw current price marker
    if (!isHovering) {
      const lastX = width - padding.right
      const lastY = padding.top + (height - padding.top - padding.bottom) - ((chartData[chartData.length - 1] - min) / range) * (height - padding.top - padding.bottom)
      
      ctx.fillStyle = priceInfo.change >= 0 ? '#10b981' : '#ef4444'
      ctx.beginPath()
      ctx.arc(lastX, lastY, 4, 0, 2 * Math.PI)
      ctx.fill()
      
      // Current price label
      ctx.fillStyle = '#1f2937'
      ctx.font = '12px Inter'
      ctx.textAlign = 'right'
      ctx.fillText(chartData[chartData.length - 1].toFixed(2), lastX - 8, lastY - 8)
    }

    // Draw hover indicator
    if (isHovering && hoverData) {
      const x = padding.left + (hoverData.index / (chartData.length - 1)) * (width - padding.left - padding.right)
      const y = padding.top + (height - padding.top - padding.bottom) - ((hoverData.value - min) / range) * (height - padding.top - padding.bottom)
      
      // Vertical line
      ctx.strokeStyle = '#9ca3af'
      ctx.setLineDash([5, 3])
      ctx.beginPath()
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, height - padding.bottom)
      ctx.stroke()
      ctx.setLineDash([])
      
      // Point marker
      ctx.fillStyle = '#1f2937'
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
      
      // Hover info box
      ctx.fillStyle = 'rgba(31, 41, 55, 0.95)'
      ctx.beginPath()
      const boxWidth = 120
      const boxHeight = 60
      const boxX = x > width / 2 ? x - boxWidth - 10 : x + 10
      const boxY = y - boxHeight / 2
      
      ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 6)
      ctx.fill()
      
      // Hover info text
      ctx.fillStyle = '#ffffff'
      ctx.font = '12px Inter'
      ctx.textAlign = 'left'
      ctx.fillText(`$${hoverData.value.toFixed(2)}`, boxX + 10, boxY + 20)
      ctx.fillText(`Change: ${(hoverData.value - chartData[0]).toFixed(2)}`, boxX + 10, boxY + 40)
    }

  }, [chartData, priceInfo.change, isHovering, hoverData])

  // Handle mouse events for hover effect
  const handleMouseMove = (e) => {
    if (!canvasRef.current || chartData.length === 0) return
    
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const paddingLeft = 50
    const paddingRight = 20
    const chartWidth = canvas.width - paddingLeft - paddingRight
    
    const index = Math.round(((x - paddingLeft) / chartWidth) * (chartData.length - 1))
    
    if (index >= 0 && index < chartData.length) {
      setIsHovering(true)
      setHoverData({
        index,
        value: chartData[index]
      })
    } else {
      setIsHovering(false)
      setHoverData(null)
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setHoverData(null)
  }

  const handleCompanyChange = (symbol) => {
    setSelectedSymbol(symbol)
    setLoading(true)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center space-x-3">
            <select
              value={selectedSymbol}
              onChange={(e) => handleCompanyChange(e.target.value)}
              className="text-xl font-semibold text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0"
            >
              {companies.map(company => (
                <option key={company.symbol} value={company.symbol}>
                  {company.symbol} - {company.name}
                </option>
              ))}
            </select>
            <span className="text-xl font-semibold text-gray-800">Chart</span>
          </div>
          <div className="flex items-center mt-4 sm:mt-0">
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mr-3"></div>
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex space-x-2">
            {timeFrames.map(tf => (
              <button key={tf} className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg">
                {tf}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  const selectedCompany = companies.find(c => c.symbol === selectedSymbol)

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <select
            value={selectedSymbol}
            onChange={(e) => handleCompanyChange(e.target.value)}
            className="text-xl font-semibold text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer"
          >
            {companies.map(company => (
              <option key={company.symbol} value={company.symbol}>
                {company.symbol} - {company.name}
              </option>
            ))}
          </select>
          <span className="text-xl font-semibold text-gray-800">Chart</span>
        </div>
        <div className="flex items-center">
          <span className="text-2xl font-bold text-gray-900">
            ${priceInfo.current.toFixed(2)}
          </span>
          <span className={`ml-3 px-2 py-1 rounded text-sm font-medium ${
            priceInfo.change >= 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {priceInfo.change >= 0 ? '+' : ''}{priceInfo.change.toFixed(2)} ({priceInfo.changePercent >= 0 ? '+' : ''}{priceInfo.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {timeFrames.map(tf => (
          <button
            key={tf}
            onClick={() => setActiveTimeFrame(tf)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeTimeFrame === tf
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>
      
      <div 
        className="relative" 
        style={{ height: `${height}px` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={height}
          className="w-full h-full"
        />
      </div>
      
      <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
        <span>{selectedCompany?.name} • {activeTimeFrame} View</span>
        <span>Real-time updates (every 5s)</span>
      </div>
    </div>
  )
}

export default RealTimeChart