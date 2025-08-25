// contexts/TransactionContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    setIsLoading(false);
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions, isLoading]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  // ADD THIS FUNCTION
  const getTransactionsBySymbol = (symbol) => {
    return transactions.filter(t => t.symbol === symbol);
  };

  const getCashBalance = () => {
    return transactions.reduce((balance, transaction) => {
      if (transaction.type === 'deposit') {
        return balance + transaction.amount;
      } else if (transaction.type === 'withdrawal') {
        return balance - transaction.amount;
      }
      return balance;
    }, 0);
  };

  const getTotalInvested = () => {
    return transactions.reduce((total, transaction) => {
      if (transaction.type === 'buy') {
        return total + transaction.amount;
      } else if (transaction.type === 'sell') {
        return total - transaction.amount;
      }
      return total;
    }, 0);
  };

  const getRecentTransactions = (limit = 5) => {
    return transactions.slice(0, limit);
  };

  const value = {
    transactions,
    isLoading,
    addTransaction,
    getTransactionsBySymbol, // ADD THIS TO THE PROVIDED VALUE
    getCashBalance,
    getTotalInvested,
    getRecentTransactions,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};