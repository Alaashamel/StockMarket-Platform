import { useState } from 'react'

const TechnicalIndicator = () => {
  const [selectedIndicators, setSelectedIndicators] = useState(['SMA', 'RSI'])
  const [indicatorSettings, setIndicatorSettings] = useState({
    SMA: { period: 20, color: '#3b82f6' },
    EMA: { period: 20, color: '#8b5cf6' },
    RSI: { period: 14, overbought: 70, oversold: 30, color: '#10b981' },
    MACD: { fast: 12, slow: 26, signal: 9, color: '#f59e0b' },
    Bollinger: { period: 20, deviation: 2, color: '#ef4444' },
    Stochastic: { kPeriod: 14, dPeriod: 3, smoothing: 3, color: '#06b6d4' }
  })

  const indicators = [
    { 
      id: 'SMA', 
      name: 'Simple Moving Average', 
      description: 'Average price over a specific period',
      defaultPeriod: 20
    },
    { 
      id: 'EMA', 
      name: 'Exponential Moving Average', 
      description: 'Weighted average that gives more importance to recent prices',
      defaultPeriod: 20
    },
    { 
      id: 'RSI', 
      name: 'Relative Strength Index', 
      description: 'Momentum oscillator measuring speed and change of price movements',
      defaultPeriod: 14
    },
    { 
      id: 'MACD', 
      name: 'Moving Average Convergence Divergence', 
      description: 'Trend-following momentum indicator showing relationship between two moving averages',
      defaultPeriod: null
    },
    { 
      id: 'Bollinger', 
      name: 'Bollinger Bands', 
      description: 'Volatility bands placed above and below a moving average',
      defaultPeriod: 20
    },
    { 
      id: 'Stochastic', 
      name: 'Stochastic Oscillator', 
      description: 'Momentum indicator comparing a particular closing price to a range of prices over time',
      defaultPeriod: 14
    },
  ]

  const toggleIndicator = (indicatorId) => {
    if (selectedIndicators.includes(indicatorId)) {
      setSelectedIndicators(selectedIndicators.filter(id => id !== indicatorId))
    } else {
      setSelectedIndicators([...selectedIndicators, indicatorId])
    }
  }

  const updateIndicatorSetting = (indicatorId, key, value) => {
    setIndicatorSettings(prev => ({
      ...prev,
      [indicatorId]: {
        ...prev[indicatorId],
        [key]: value
      }
    }))
  }

  const getIndicatorColor = (indicatorId) => {
    return indicatorSettings[indicatorId]?.color || '#3b82f6'
  }

  const IndicatorSettings = ({ indicatorId }) => {
    const settings = indicatorSettings[indicatorId]
    if (!settings) return null

    return (
      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Settings</span>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">Color:</span>
            <input
              type="color"
              value={settings.color}
              onChange={(e) => updateIndicatorSetting(indicatorId, 'color', e.target.value)}
              className="w-6 h-6 rounded cursor-pointer"
            />
          </div>
        </div>

        {indicatorId === 'SMA' || indicatorId === 'EMA' ? (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600">Period</label>
              <input
                type="number"
                min="1"
                max="200"
                value={settings.period}
                onChange={(e) => updateIndicatorSetting(indicatorId, 'period', parseInt(e.target.value))}
                className="w-full p-1 text-sm border border-gray-300 rounded"
              />
            </div>
          </div>
        ) : indicatorId === 'RSI' ? (
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-gray-600">Period</label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.period}
                onChange={(e) => updateIndicatorSetting(indicatorId, 'period', parseInt(e.target.value))}
                className="w-full p-1 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Overbought</label>
              <input
                type="number"
                min="50"
                max="90"
                value={settings.overbought}
                onChange={(e) => updateIndicatorSetting(indicatorId, 'overbought', parseInt(e.target.value))}
                className="w-full p-1 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Oversold</label>
              <input
                type="number"
                min="10"
                max="50"
                value={settings.oversold}
                onChange={(e) => updateIndicatorSetting(indicatorId, 'oversold', parseInt(e.target.value))}
                className="w-full p-1 text-sm border border-gray-300 rounded"
              />
            </div>
          </div>
        ) : indicatorId === 'MACD' ? (
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-gray-600">Fast</label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.fast}
                onChange={(e) => updateIndicatorSetting(indicatorId, 'fast', parseInt(e.target.value))}
                className="w-full p-1 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Slow</label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.slow}
                onChange={(e) => updateIndicatorSetting(indicatorId, 'slow', parseInt(e.target.value))}
                className="w-full p-1 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Signal</label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.signal}
                onChange={(e) => updateIndicatorSetting(indicatorId, 'signal', parseInt(e.target.value))}
                className="w-full p-1 text-sm border border-gray-300 rounded"
              />
            </div>
          </div>
        ) : indicatorId === 'Bollinger' ? (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600">Period</label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.period}
                onChange={(e) => updateIndicatorSetting(indicatorId, 'period', parseInt(e.target.value))}
                className="w-full p-1 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Deviation</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={settings.deviation}
                onChange={(e) => updateIndicatorSetting(indicatorId, 'deviation', parseFloat(e.target.value))}
                className="w-full p-1 text-sm border border-gray-300 rounded"
              />
            </div>
          </div>
        ) : indicatorId === 'Stochastic' ? (
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-gray-600">K Period</label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.kPeriod}
                onChange={(e) => updateIndicatorSetting(indicatorId, 'kPeriod', parseInt(e.target.value))}
                className="w-full p-1 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">D Period</label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.dPeriod}
                onChange={(e) => updateIndicatorSetting(indicatorId, 'dPeriod', parseInt(e.target.value))}
                className="w-full p-1 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Smoothing</label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.smoothing}
                onChange={(e) => updateIndicatorSetting(indicatorId, 'smoothing', parseInt(e.target.value))}
                className="w-full p-1 text-sm border border-gray-300 rounded"
              />
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Technical Indicators</h3>
          <p className="text-sm text-gray-600 mt-1">Add technical indicators to your charts</p>
        </div>
        <div className="text-sm text-gray-500">
          {selectedIndicators.length} of {indicators.length} selected
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {indicators.map(indicator => {
          const isSelected = selectedIndicators.includes(indicator.id)
          const color = getIndicatorColor(indicator.id)
          
          return (
            <div
              key={indicator.id}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => toggleIndicator(indicator.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: color }}
                    />
                    <h4 className="font-semibold text-gray-800">{indicator.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{indicator.description}</p>
                  
                  {isSelected && <IndicatorSettings indicatorId={indicator.id} />}
                </div>
                
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ml-2 ${
                  isSelected
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-white border-gray-300'
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-gray-50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-800">Active Indicators</h4>
          {selectedIndicators.length > 0 && (
            <button 
              onClick={() => setSelectedIndicators([])}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all
            </button>
          )}
        </div>
        
        {selectedIndicators.length > 0 ? (
          <div className="space-y-3">
            {selectedIndicators.map(indicatorId => {
              const indicator = indicators.find(i => i.id === indicatorId)
              const settings = indicatorSettings[indicatorId]
              
              return (
                <div key={indicatorId} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 group">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3" 
                      style={{ backgroundColor: settings.color }}
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-800">{indicator.name}</span>
                      <div className="text-xs text-gray-500 mt-1">
                        {indicatorId === 'SMA' || indicatorId === 'EMA' ? (
                          <span>Period: {settings.period}</span>
                        ) : indicatorId === 'RSI' ? (
                          <span>Period: {settings.period}, Levels: {settings.oversold}/{settings.overbought}</span>
                        ) : indicatorId === 'MACD' ? (
                          <span>Fast: {settings.fast}, Slow: {settings.slow}, Signal: {settings.signal}</span>
                        ) : indicatorId === 'Bollinger' ? (
                          <span>Period: {settings.period}, Dev: {settings.deviation}</span>
                        ) : indicatorId === 'Stochastic' ? (
                          <span>K: {settings.kPeriod}, D: {settings.dPeriod}, Smooth: {settings.smoothing}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleIndicator(indicatorId)
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-gray-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No indicators selected</p>
            <p className="text-gray-400 text-sm mt-1">Select indicators to add them to your chart</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TechnicalIndicator