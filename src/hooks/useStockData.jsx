// hooks/useStockData.jsx
import { useState, useEffect, useContext, createContext } from 'react';

const StockDataContext = createContext();

export const useStockData = () => {
  const context = useContext(StockDataContext);
  if (!context) {
    throw new Error('useStockData must be used within a StockDataProvider');
  }
  return context;
};

export const StockDataProvider = ({ children }) => {
  const [stocks, setStocks] = useState([]);
  const [customStocks, setCustomStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial stock data and custom stocks
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // load from api!!!!!!(integrate here)
        const defaultStocks = [
          {
            id: '1',
            symbol: 'AAPL',
            name: 'Apple Inc.',
            price: 175.25,
            initialPrice: 175.25,
            change: 2.34,
            changePercent: 1.35,
            marketCap: 2735000000000,
            volume: 45678900,
            sector: 'Technology',
            volatility: 0.018,
            totalShares: 15600000000
          },
          {
            id: '2',
            symbol: 'MSFT',
            name: 'Microsoft Corporation',
            price: 345.67,
            initialPrice: 345.67,
            change: 1.89,
            changePercent: 0.55,
            marketCap: 2578000000000,
            volume: 23456700,
            sector: 'Technology',
            volatility: 0.016,
            totalShares: 7460000000
          },
          {
            id: '3',
            symbol: 'GOOGL',
            name: 'Alphabet Inc.',
            price: 145.23,
            initialPrice: 145.23,
            change: 3.21,
            changePercent: 2.26,
            marketCap: 1835000000000,
            volume: 19876500,
            sector: 'Technology',
            volatility: 0.019,
            totalShares: 12600000000
          }
        ];
        
        setStocks(defaultStocks);
        
        // Load custom stocks from localStorage
        const savedCustomStocks = localStorage.getItem('customStocks');
        if (savedCustomStocks) {
          setCustomStocks(JSON.parse(savedCustomStocks));
        }
      } catch (error) {
        console.error('Error loading stock data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save custom stocks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('customStocks', JSON.stringify(customStocks));
  }, [customStocks]);

  const addStock = (stockData) => {
    return new Promise((resolve) => {
      const newStock = {
        ...stockData,
        id: `custom_${Date.now()}`,
        isCustom: true,
        listedDate: new Date().toISOString(),
        sector: stockData.sector || 'Other',
        change: 0,
        changePercent: 0,
        volume: 0
      };
      
      setCustomStocks(prev => [...prev, newStock]);
      resolve(newStock);
    });
  };

  const removeCustomStock = (stockId) => {
    return new Promise((resolve) => {
      setCustomStocks(prev => prev.filter(stock => stock.id !== stockId));
      resolve();
    });
  };

  const updateStockPrice = (stockId, newPrice) => {
    // Update price logic for real-time simulation
    setStocks(prev => prev.map(stock => 
      stock.id === stockId 
        ? { 
            ...stock, 
            price: newPrice,
            change: newPrice - stock.initialPrice,
            changePercent: ((newPrice - stock.initialPrice) / stock.initialPrice) * 100
          }
        : stock
    ));
    
    setCustomStocks(prev => prev.map(stock => 
      stock.id === stockId 
        ? { 
            ...stock, 
            price: newPrice,
            change: newPrice - stock.initialPrice,
            changePercent: ((newPrice - stock.initialPrice) / stock.initialPrice) * 100
          }
        : stock
    ));
  };

  const value = {
    stocks,
    customStocks,
    isLoading,
    addStock,
    removeCustomStock,
    updateStockPrice
  };

  return (
    <StockDataContext.Provider value={value}>
      {children}
    </StockDataContext.Provider>
  );
};