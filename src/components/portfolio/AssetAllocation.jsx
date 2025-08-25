import { useState } from 'react';

const AssetAllocation = () => {
  const [allocations] = useState([
    { 
      sector: 'Technology', 
      percentage: 45, 
      value: 5602.50, 
      color: 'bg-blue-500',
      trend: 'up',
      trendValue: '+2.3%'
    },
    { 
      sector: 'Healthcare', 
      percentage: 20, 
      value: 2490.00, 
      color: 'bg-green-500',
      trend: 'up',
      trendValue: '+1.7%'
    },
    { 
      sector: 'Financial Services', 
      percentage: 15, 
      value: 1867.50, 
      color: 'bg-yellow-500',
      trend: 'down',
      trendValue: '-0.8%'
    },
    { 
      sector: 'Consumer Cyclical', 
      percentage: 10, 
      value: 1245.00, 
      color: 'bg-red-500',
      trend: 'up',
      trendValue: '+3.1%'
    },
    { 
      sector: 'Energy', 
      percentage: 5, 
      value: 622.50, 
      color: 'bg-purple-500',
      trend: 'down',
      trendValue: '-2.2%'
    },
    { 
      sector: 'Other', 
      percentage: 5, 
      value: 622.50, 
      color: 'bg-gray-500',
      trend: 'neutral',
      trendValue: '0.0%'
    },
  ]);

  const [activeSector, setActiveSector] = useState(null);
  const totalValue = 12450;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate circumference for the donut chart
  const circumference = 2 * Math.PI * 70;

  // Trend icon component
  const TrendIcon = ({ trend, value }) => {
    if (trend === 'up') {
      return (
        <div className="flex items-center">
          <span className="text-xs font-medium text-green-600 mr-1">{value}</span>
          <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
      );
    } else if (trend === 'down') {
      return (
        <div className="flex items-center">
          <span className="text-xs font-medium text-red-600 mr-1">{value}</span>
          <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      );
    }
    return (
      <div className="flex items-center">
        <span className="text-xs font-medium text-gray-600 mr-1">{value}</span>
        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 w-full max-w-6xl mx-auto">
      {/* Header with improved spacing */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Asset Allocation</h3>
          <p className="text-gray-500 text-sm">Portfolio diversification analysis</p>
        </div>
        <div className="text-right mt-3 sm:mt-0">
          <div className="text-sm text-gray-500">Total Portfolio Value</div>
          <div className="text-xl font-bold text-gray-900">{formatCurrency(totalValue)}</div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Donut Chart - Improved spacing and sizing */}
        <div className="lg:w-1/3 flex flex-col items-center">
          <div className="relative h-40 w-40 mb-6">
            <svg className="w-full h-full" viewBox="0 0 160 160">
              <circle
                className="text-gray-200"
                strokeWidth="14"
                stroke="currentColor"
                fill="transparent"
                r="70"
                cx="80"
                cy="80"
              />
              
              {allocations.map((item, index, array) => {
                const strokeDasharray = circumference;
                const percent = item.percentage;
                const offset = array.slice(0, index).reduce((sum, i) => sum + i.percentage, 0);
                const strokeDashoffset = circumference - (percent / 100) * circumference;
                
                return (
                  <circle
                    key={item.sector}
                    className={`${item.color} ${activeSector === item.sector ? 'opacity-100' : 'opacity-90'} transition-opacity duration-200`}
                    strokeWidth="14"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="70"
                    cx="80"
                    cy="80"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform={`rotate(${-90 + (offset / 100) * 360}, 80, 80)`}
                    onMouseEnter={() => setActiveSector(item.sector)}
                    onMouseLeave={() => setActiveSector(null)}
                  />
                );
              })}
              
              {/* Center text */}
              <text x="80" y="75" textAnchor="middle" className="text-3xl font-bold fill-gray-800">
                {activeSector ? 
                  allocations.find(a => a.sector === activeSector)?.percentage + '%' : 
                  '100%'}
              </text>
              <text x="80" y="95" textAnchor="middle" className="text-sm fill-gray-500">
                {activeSector || 'Allocation'}
              </text>
            </svg>
          </div>
          
          {/* Chart legend */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-md">
            {allocations.map(item => (
              <div 
                key={item.sector} 
                className="flex items-center cursor-pointer"
                onMouseEnter={() => setActiveSector(item.sector)}
                onMouseLeave={() => setActiveSector(null)}
              >
                <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
                <span className="text-xs text-gray-600">{item.sector}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Allocation Details - Improved spacing and sizing */}
        <div className="lg:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allocations.map(item => (
              <div 
                key={item.sector}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  activeSector === item.sector 
                    ? 'border-blue-300 bg-blue-50 transform scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onMouseEnter={() => setActiveSector(item.sector)}
                onMouseLeave={() => setActiveSector(null)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${item.color} mr-2`}></div>
                    <span className="text-base font-semibold text-gray-800">{item.sector}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-gray-900">{item.percentage}%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-500">Value</div>
                  <div className="text-base font-semibold text-gray-900">{formatCurrency(item.value)}</div>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-500">Performance</div>
                  <TrendIcon trend={item.trend} value={item.trendValue} />
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div 
                    className={`h-2 rounded-full ${item.color} transition-all duration-300`} 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>{item.percentage}%</span>
                  <span>100%</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Performance Summary - Improved spacing */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Well-Diversified Portfolio</h3>
                <p className="text-sm text-blue-600 mt-1">Your assets are spread across multiple sectors for optimal risk management</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocation;