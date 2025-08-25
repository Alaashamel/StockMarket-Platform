import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';

const BalanceContext = createContext();

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(10000); // Default $10,000
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const { user, isAuthenticated } = useAuth();

  // Generate user-specific storage key
  const storageKey = useMemo(() => {
    return user ? `userBalance_${user.id}` : 'userBalance';
  }, [user]);

  // Load balance from localStorage
  useEffect(() => {
    const loadBalance = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const savedBalance = localStorage.getItem(storageKey);
        const savedHistory = localStorage.getItem(`${storageKey}_history`);
        
        if (savedBalance) {
          const parsedBalance = parseFloat(savedBalance);
          if (!isNaN(parsedBalance) && parsedBalance >= 0) {
            setBalance(parsedBalance);
          }
        }
        
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          // Validate history data
          const validHistory = parsedHistory.filter(item => 
            item && item.amount && item.type && item.timestamp
          );
          setTransactionHistory(validHistory);
        }
      } catch (error) {
        console.error('Error loading balance data:', error);
        setError('Failed to load balance information');
        
        // Attempt to recover by resetting corrupted data
        localStorage.removeItem(storageKey);
        localStorage.removeItem(`${storageKey}_history`);
      } finally {
        setIsLoading(false);
      }
    };

    loadBalance();
  }, [isAuthenticated, storageKey]);

  // Save balance and history to localStorage when they change
  useEffect(() => {
    if (isAuthenticated) {
      try {
        localStorage.setItem(storageKey, balance.toString());
        localStorage.setItem(`${storageKey}_history`, JSON.stringify(transactionHistory));
      } catch (error) {
        console.error('Error saving balance data:', error);
        setError('Failed to save balance information');
      }
    }
  }, [balance, transactionHistory, isAuthenticated, storageKey]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const addTransactionRecord = useCallback((amount, type, description = '') => {
    const transaction = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.abs(amount),
      type,
      description,
      timestamp: new Date().toISOString(),
      balanceAfter: balance + (type === 'credit' ? amount : -amount)
    };

    setTransactionHistory(prev => [transaction, ...prev.slice(0, 49)]); // Keep last 50 transactions
  }, [balance]);

  const updateBalance = useCallback((amount, description = '') => {
    try {
      if (typeof amount !== 'number' || isNaN(amount)) {
        throw new Error('Invalid amount specified');
      }

      setBalance(prev => {
        const newBalance = prev + amount;
        
        // Prevent negative balance with proper validation
        if (newBalance < 0) {
          throw new Error('Insufficient funds');
        }

        if (newBalance > 1000000000) { // $1 billion limit
          throw new Error('Balance limit exceeded');
        }

        // Add transaction record
        addTransactionRecord(
          amount, 
          amount >= 0 ? 'credit' : 'debit', 
          description
        );

        return newBalance;
      });
      
      setError(null);
      return balance + amount;
    } catch (error) {
      console.error('Error updating balance:', error);
      setError(error.message || 'Failed to update balance');
      throw error;
    }
  }, [balance, addTransactionRecord]);

  const resetBalance = useCallback(() => {
    try {
      const previousBalance = balance;
      setBalance(10000);
      
      // Record the reset transaction
      addTransactionRecord(
        10000 - previousBalance,
        'adjustment',
        'Portfolio reset to $10,000'
      );
      
      setError(null);
    } catch (error) {
      console.error('Error resetting balance:', error);
      setError('Failed to reset balance');
    }
  }, [balance, addTransactionRecord]);

  const getBalanceHistory = useCallback((timeframe = 'all') => {
    const now = new Date();
    let filteredHistory = transactionHistory;

    switch (timeframe) {
      case 'day':
        filteredHistory = transactionHistory.filter(item => 
          new Date(item.timestamp) > new Date(now.setDate(now.getDate() - 1))
        );
        break;
      case 'week':
        filteredHistory = transactionHistory.filter(item => 
          new Date(item.timestamp) > new Date(now.setDate(now.getDate() - 7))
        );
        break;
      case 'month':
        filteredHistory = transactionHistory.filter(item => 
          new Date(item.timestamp) > new Date(now.setMonth(now.getMonth() - 1))
        );
        break;
      default:
        // 'all' - no filtering needed
        break;
    }

    return filteredHistory;
  }, [transactionHistory]);

  const getTotalDeposits = useCallback((timeframe = 'all') => {
    const history = getBalanceHistory(timeframe);
    return history
      .filter(item => item.type === 'credit')
      .reduce((total, item) => total + item.amount, 0);
  }, [getBalanceHistory]);

  const getTotalWithdrawals = useCallback((timeframe = 'all') => {
    const history = getBalanceHistory(timeframe);
    return history
      .filter(item => item.type === 'debit')
      .reduce((total, item) => total + item.amount, 0);
  }, [getBalanceHistory]);

  const formatBalance = useCallback((value = balance) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }, [balance]);

  const value = useMemo(() => ({
    balance,
    updateBalance,
    resetBalance,
    getBalanceHistory,
    getTotalDeposits,
    getTotalWithdrawals,
    formatBalance,
    isLoading,
    error,
    transactionHistory
  }), [
    balance,
    updateBalance,
    resetBalance,
    getBalanceHistory,
    getTotalDeposits,
    getTotalWithdrawals,
    formatBalance,
    isLoading,
    error,
    transactionHistory
  ]);

  return (
    <BalanceContext.Provider value={value}>
      {children}
    </BalanceContext.Provider>
  );
};