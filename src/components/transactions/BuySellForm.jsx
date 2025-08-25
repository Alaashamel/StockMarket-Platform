import { useState, useMemo, useEffect, useCallback } from 'react';
import { useBalance } from '../../contexts/BalanceContext';
import { useTransactions } from '../../contexts/TransactionContext';
import { FiArrowUp, FiArrowDown, FiDollarSign, FiPieChart, FiSearch, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const BuySellStocks = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('buy');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState(null);
  
  const { balance, updateBalance } = useBalance();
  const { addTransaction, getTransactionsBySymbol } = useTransactions();

  // Memoize available stocks to prevent recreation on each render
  const availableStocks = useMemo(() => [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 176.08, change: 1.2, changePercent: 0.69 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 337.69, change: -0.5, changePercent: -0.15 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: 2.0, changePercent: 1.47 },
    { symbol: 'XOM', name: 'Exxon Mobil Corp.', price: 118.72, change: 2.31, changePercent: 1.98 },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 168.32, change: 1.15, changePercent: 0.69 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.67, change: -3.45, changePercent: -1.39 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 456.78, change: 12.34, changePercent: 2.78 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.89, change: 0.89, changePercent: 0.50 }
  ], []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter stocks based on search term
  const filteredStocks = useMemo(() => {
    return availableStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [debouncedSearchTerm, availableStocks]);

  // Calculate owned shares for selected stock
  const ownedShares = useMemo(() => {
    if (!selectedStock?.symbol) return 0;
    
    const transactions = getTransactionsBySymbol(selectedStock.symbol);
    const buyTransactions = transactions.filter(t => t.type === 'buy');
    const sellTransactions = transactions.filter(t => t.type === 'sell');
    
    const totalBought = buyTransactions.reduce((sum, t) => sum + t.quantity, 0);
    const totalSold = sellTransactions.reduce((sum, t) => sum + t.quantity, 0);
    
    return totalBought - totalSold;
  }, [selectedStock, getTransactionsBySymbol]);

  const totalCost = useMemo(() => {
    const qty = Number(quantity) || 0;
    return qty * (selectedStock?.price || 0);
  }, [quantity, selectedStock]);

  // Reset form when stock changes
  useEffect(() => {
    setQuantity('');
    setError('');
    setSuccess('');
  }, [selectedStock]);

  // Clean up pending transactions when component unmounts
  useEffect(() => {
    return () => {
      setPendingTransaction(null);
      setShowConfirmation(false);
    };
  }, []);

  const validateForm = () => {
    const qty = Number(quantity);
    
    if (!selectedStock) {
      throw new Error('Please select a stock');
    }

    if (!quantity || isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
      throw new Error('Please enter a valid whole number for quantity');
    }

    if (activeTab === 'buy') {
      if (balance < totalCost) {
        throw new Error('Insufficient funds for this purchase');
      }
    } else {
      if (ownedShares < qty) {
        throw new Error(`You only own ${ownedShares} share${ownedShares !== 1 ? 's' : ''}`);
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      validateForm();
      const transactionType = activeTab;
      const qty = Number(quantity);

      // Show confirmation dialog for large transactions
      if (totalCost > balance * 0.1) { // 10% of balance
        setPendingTransaction({
          type: transactionType,
          symbol: selectedStock.symbol,
          quantity: qty,
          totalCost
        });
        setShowConfirmation(true);
        setIsSubmitting(false);
        return;
      }

      // Execute transaction immediately for smaller amounts
      executeTransaction(transactionType, qty);
      
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const executeTransaction = useCallback((transactionType, qty) => {
    if (!selectedStock) return;
    
    // Update balance
    updateBalance(transactionType === 'buy' ? -totalCost : totalCost);

    // Record transaction
    addTransaction({
      type: transactionType,
      symbol: selectedStock.symbol,
      name: selectedStock.name,
      quantity: qty,
      price: selectedStock.price,
      total: totalCost,
      timestamp: new Date().toISOString()
    });

    // Reset form and show success
    setQuantity('');
    setSuccess(`${transactionType.toUpperCase()} order executed successfully!`);
    setShowConfirmation(false);
    setPendingTransaction(null);
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(''), 3000);
    setIsSubmitting(false);
  }, [selectedStock, totalCost, updateBalance, addTransaction]);

  const handlePercentage = (percentage) => {
    if (!selectedStock) return;
    
    if (activeTab === 'buy') {
      const maxAffordable = Math.floor(balance / selectedStock.price);
      const calculatedShares = Math.floor(maxAffordable * percentage / 100);
      setQuantity(Math.max(1, calculatedShares).toString()); // Ensure at least 1 share
    } else {
      const calculatedShares = Math.floor(ownedShares * percentage / 100);
      setQuantity(Math.max(1, calculatedShares).toString()); // Ensure at least 1 share
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatChange = (change, changePercent) => {
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${change >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`;
  };

  const isBuyDisabled = isSubmitting || !quantity || totalCost > balance || !selectedStock;
  const isSellDisabled = isSubmitting || !quantity || Number(quantity) > ownedShares || ownedShares === 0 || !selectedStock;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Confirmation Dialog */}
      {showConfirmation && pendingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Transaction</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to {pendingTransaction.type} {pendingTransaction.quantity} shares of {pendingTransaction.symbol} for {formatCurrency(pendingTransaction.totalCost)}?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => executeTransaction(pendingTransaction.type, pendingTransaction.quantity)}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Selection Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Stock</h3>
          
          {/* Search Input */}
          <div className="relative mb-4">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search stocks..."
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredStocks.map((stock) => (
            <div
              key={stock.symbol}
              onClick={() => setSelectedStock(stock)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedStock?.symbol === stock.symbol ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{stock.symbol}</h4>
                      <p className="text-sm text-gray-600">{stock.name}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800">{formatCurrency(stock.price)}</div>
                  <div className={`flex items-center text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                    {formatChange(stock.change, stock.changePercent)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredStocks.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <FiSearch className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No stocks found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}
        </div>
      </div>

      {/* Trading Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header with tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex-1 py-4 px-6 text-center font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'buy' 
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FiArrowUp className="w-5 h-5" />
            Buy
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`flex-1 py-4 px-6 text-center font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'sell' 
                ? 'text-red-600 border-b-2 border-red-600 bg-red-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FiArrowDown className="w-5 h-5" />
            Sell
          </button>
        </div>

        <div className="p-6">
          {!selectedStock ? (
            <div className="text-center py-12">
              <FiPieChart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Select a Stock</h3>
              <p className="text-gray-500">Choose a stock from the list to begin trading</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedStock.symbol}</h3>
                  <span className="text-sm text-gray-500">{selectedStock.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">{formatCurrency(selectedStock.price)}</div>
                  <div className={`flex items-center text-sm ${selectedStock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedStock.change >= 0 ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                    {formatChange(selectedStock.change, selectedStock.changePercent)}
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-medium">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Quantity Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={quantity}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^[1-9]\d*$/.test(value)) {
                          setQuantity(value);
                        }
                      }}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                      placeholder="0"
                      disabled={isSubmitting}
                    />
                    
                    {/* Quick Percentage Buttons */}
                    <div className="flex space-x-2 mt-3">
                      {[25, 50, 75, 100].map(percent => (
                        <button
                          key={percent}
                          type="button"
                          onClick={() => handlePercentage(percent)}
                          className="flex-1 py-2 px-3 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                          aria-label={`Select ${percent} percent of available ${activeTab === 'buy' ? 'funds' : 'shares'}`}
                          role="button"
                          tabIndex={0}
                        >
                          {percent}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price and Total Information */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Current Price</span>
                      <span className="text-lg font-semibold">{formatCurrency(selectedStock.price)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Estimated Total</span>
                      <span className="text-lg font-semibold">{formatCurrency(totalCost)}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          {activeTab === 'buy' ? 'Balance After' : 'Proceeds'}
                        </span>
                        <span className={`text-lg font-semibold ${
                          activeTab === 'buy' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(activeTab === 'buy' ? balance - totalCost : balance + totalCost)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ownership Info */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FiPieChart className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm text-blue-700">Shares Owned</span>
                      </div>
                      <span className="text-sm font-semibold text-blue-800">{ownedShares}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={activeTab === 'buy' ? isBuyDisabled : isSellDisabled}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
                      activeTab === 'buy' 
                        ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-300' 
                        : 'bg-red-600 hover:bg-red-700 disabled:bg-red-300'
                    } disabled:cursor-not-allowed`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        {activeTab === 'buy' ? 'Buy' : 'Sell'} {selectedStock.symbol}
                        <FiDollarSign className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Current Balance */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available Balance</span>
                  <span className="text-lg font-semibold text-gray-800">{formatCurrency(balance)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuySellStocks;