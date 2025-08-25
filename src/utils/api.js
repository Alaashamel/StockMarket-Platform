// src/utils/api.js
// Mock API functions - in a real app, these would fetch from actual endpoints
export const fetchStockData = async (symbol) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Mock data
  const mockData = {
    symbol,
    price: 150 + Math.random() * 100,
    change: (Math.random() - 0.5) * 10,
    volume: Math.floor(Math.random() * 10000000),
    marketCap: Math.floor(Math.random() * 1000000000000),
    peRatio: 10 + Math.random() * 30,
  }
  
  return mockData
}

export const fetchMarketNews = async (limit = 10) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Mock news data
  const mockNews = [
    {
      id: 1,
      title: 'Tech Company Stocks Rise After Strong Earnings Report',
      summary: 'Tech company announced earnings that exceeded analyst expectations, driving its stock up more than 5% in today\'s trading.',
      source: 'CNBC',
      date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      image: 'https://via.placeholder.com/300x150?text=Tech+News'
    },
    {
      id: 2,
      title: 'Central Bank Announces New Monetary Policies',
      summary: 'The central bank announced maintaining interest rates with expectations of moderate economic growth in the next quarter.',
      source: 'Bloomberg',
      date: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      image: 'https://via.placeholder.com/300x150?text=Economy'
    },
    {
      id: 3,
      title: 'Largest IPO of the Year Launches',
      summary: 'A startup company is set to go public in the largest IPO this year with a valuation exceeding $10 billion.',
      source: 'Reuters',
      date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      image: 'https://via.placeholder.com/300x150?text=IPO'
    },
  ]
  
  return limit ? mockNews.slice(0, limit) : mockNews
}

export const fetchPortfolioData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Check if there's a saved portfolio in localStorage
  const savedPortfolio = localStorage.getItem('userPortfolio')
  if (savedPortfolio) {
    return JSON.parse(savedPortfolio)
  }
  
  // Mock portfolio data
  const mockPortfolio = {
    totalValue: 12450.75,
    dailyChange: 245.32,
    dailyChangePercent: 2.01,
    stocks: [
      { symbol: 'AAPL', name: 'Apple Inc.', shares: 10, avgPrice: 150.25, currentPrice: 176.08, value: 1760.80, sector: 'Technology' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', shares: 5, avgPrice: 300.50, currentPrice: 337.69, value: 1688.45, sector: 'Technology' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 8, avgPrice: 125.75, currentPrice: 138.21, value: 1105.68, sector: 'Technology' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 6, avgPrice: 135.00, currentPrice: 142.07, value: 852.42, sector: 'Consumer Cyclical' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', shares: 15, avgPrice: 160.00, currentPrice: 152.34, value: 2285.10, sector: 'Healthcare' },
      { symbol: 'XOM', name: 'Exxon Mobil Corporation', shares: 20, avgPrice: 110.00, currentPrice: 118.72, value: 2374.40, sector: 'Energy' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.', shares: 12, avgPrice: 155.00, currentPrice: 168.32, value: 2019.84, sector: 'Financial Services' },
    ]
  }
  
  return mockPortfolio
}