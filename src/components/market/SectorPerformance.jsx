import { useState, useEffect } from 'react';

const SectorPerformance = ({ detailed = false }) => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('1d'); // 1d, 1w, 1m, 3m
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('performance'); // performance, name, allocation

  useEffect(() => {
    // Simulate API call to get company data
    const fetchCompanyData = () => {
      setIsLoading(true);
      
      // Mock data - in a real app, this would come from an API
      const mockCompanyData = [
        {
          id: 1,
          name: 'Apple Inc.',
          symbol: 'AAPL',
          sector: 'Technology',
          performance: 2.8,
          trend: 'up',
          marketCap: 2800000000000,
          volume: 75000000,
          price: 175.25,
          allocation: 15,
          description: 'Consumer electronics, software, and online services'
        },
        {
          id: 2,
          name: 'Microsoft Corporation',
          symbol: 'MSFT',
          sector: 'Technology',
          performance: 1.9,
          trend: 'up',
          marketCap: 2200000000000,
          volume: 45000000,
          price: 345.67,
          allocation: 12,
          description: 'Software, cloud computing, and hardware'
        },
        {
          id: 3,
          name: 'Johnson & Johnson',
          symbol: 'JNJ',
          sector: 'Healthcare',
          performance: 0.7,
          trend: 'up',
          marketCap: 450000000000,
          volume: 12000000,
          price: 168.32,
          allocation: 8,
          description: 'Pharmaceuticals, medical devices, and consumer health'
        },
        {
          id: 4,
          name: 'JPMorgan Chase & Co.',
          symbol: 'JPM',
          sector: 'Financial Services',
          performance: -1.2,
          trend: 'down',
          marketCap: 480000000000,
          volume: 18000000,
          price: 158.45,
          allocation: 7,
          description: 'Banking and financial services'
        },
        {
          id: 5,
          name: 'Exxon Mobil Corporation',
          symbol: 'XOM',
          sector: 'Energy',
          performance: 3.5,
          trend: 'up',
          marketCap: 450000000000,
          volume: 25000000,
          price: 105.78,
          allocation: 6,
          description: 'Oil and gas exploration and production'
        },
        {
          id: 6,
          name: 'Amazon.com Inc.',
          symbol: 'AMZN',
          sector: 'Consumer Cyclical',
          performance: 1.2,
          trend: 'up',
          marketCap: 1500000000000,
          volume: 55000000,
          price: 145.23,
          allocation: 10,
          description: 'E-commerce, cloud computing, and digital streaming'
        },
        {
          id: 7,
          name: 'Tesla Inc.',
          symbol: 'TSLA',
          sector: 'Consumer Cyclical',
          performance: -2.1,
          trend: 'down',
          marketCap: 650000000000,
          volume: 95000000,
          price: 205.34,
          allocation: 5,
          description: 'Electric vehicles and clean energy'
        },
        {
          id: 8,
          name: 'Visa Inc.',
          symbol: 'V',
          sector: 'Financial Services',
          performance: 0.8,
          trend: 'up',
          marketCap: 520000000000,
          volume: 15000000,
          price: 250.89,
          allocation: 6,
          description: 'Digital payments and financial services'
        },
        {
          id: 9,
          name: 'Procter & Gamble Co.',
          symbol: 'PG',
          sector: 'Consumer Defensive',
          performance: 0.5,
          trend: 'up',
          marketCap: 380000000000,
          volume: 8000000,
          price: 152.67,
          allocation: 4,
          description: 'Consumer goods and personal care products'
        },
        {
          id: 10,
          name: 'UnitedHealth Group Inc.',
          symbol: 'UNH',
          sector: 'Healthcare',
          performance: 1.8,
          trend: 'up',
          marketCap: 480000000000,
          volume: 7000000,
          price: 512.34,
          allocation: 7,
          description: 'Health insurance and healthcare services'
        }
      ];

      // Apply timeframe filter (simulated)
      const adjustedData = mockCompanyData.map(company => {
        let adjustedPerformance = company.performance;
        
        switch(timeframe) {
          case '1w':
            adjustedPerformance = company.performance * (0.8 + Math.random() * 0.4);
            break;
          case '1m':
            adjustedPerformance = company.performance * (0.6 + Math.random() * 0.8);
            break;
          case '3m':
            adjustedPerformance = company.performance * (0.4 + Math.random() * 1.2);
            break;
          default:
            break;
        }

        return {
          ...company,
          performance: parseFloat(adjustedPerformance.toFixed(2))
        };
      });

      // Sort the data
      const sortedData = [...adjustedData].sort((a, b) => {
        if (sortBy === 'performance') {
          return b.performance - a.performance;
        } else if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else if (sortBy === 'allocation') {
          return b.allocation - a.allocation;
        }
        return 0;
      });

      // Filter by search term if needed
      const filteredData = searchTerm === '' 
        ? sortedData 
        : sortedData.filter(company => 
            company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.symbol.toLowerCase().includes(searchTerm.toLowerCase())
          );

      setCompanies(filteredData);
      setIsLoading(false);
    };

    fetchCompanyData();
  }, [timeframe, searchTerm, sortBy]);

  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(1)}B`;
    }
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    }
    return `$${num}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-gray-800">Company Performance</h3>
        
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 text-sm rounded-lg border border-gray-300 bg-white"
          />
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 text-sm rounded-lg border border-gray-300 bg-white"
          >
            <option value="performance">Sort by Performance</option>
            <option value="name">Sort by Name</option>
            <option value="allocation">Sort by Allocation</option>
          </select>
          
          <div className="flex space-x-1">
            {['1d', '1w', '1m', '3m'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  timeframe === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period === '1d' ? '1D' : period === '1w' ? '1W' : period === '1m' ? '1M' : '3M'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {companies.length > 0 ? (
          companies.map((company) => (
            <div key={company.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-bold text-blue-600">
                        {company.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{company.name}</h4>
                      <p className="text-xs text-gray-500">{company.symbol} • {company.sector}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ml-2 ${
                    company.performance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {company.performance >= 0 ? '+' : ''}{company.performance}%
                  </span>
                </div>
                
                {detailed && (
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>{company.description}</p>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <span>Market Cap: {formatNumber(company.marketCap)}</span>
                      <span>Volume: {formatNumber(company.volume)}</span>
                      <span>Price: ${company.price}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {detailed && (
                <div className="ml-4 text-right">
                  <div className="text-sm font-semibold text-gray-800">{company.allocation}%</div>
                  <div className="text-xs text-gray-500">Allocation</div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No companies found matching your search.
          </div>
        )}
      </div>

      {detailed && companies.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-4">Company Allocation</h4>
          <div className="space-y-3">
            {companies.map((company) => (
              <div key={company.id}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{company.name}</span>
                  <span className="font-medium text-gray-800">{company.allocation}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${company.allocation}%`,
                      backgroundColor: getSectorColor(company.sector)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>Data updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

// Helper function to get sector colors
const getSectorColor = (sectorName) => {
  const colors = {
    'Technology': '#3B82F6',    // Blue
    'Healthcare': '#10B981',    // Green
    'Financial Services': '#F59E0B', // Yellow
    'Energy': '#EF4444',        // Red
    'Consumer Cyclical': '#8B5CF6', // Purple
    'Consumer Defensive': '#06B6D4', // Cyan
    'Industrials': '#64748B'      // Gray
  };
  
  return colors[sectorName] || '#6B7280'; // Default gray
};

export default SectorPerformance;