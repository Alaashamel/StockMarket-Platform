import { useState } from 'react';
import { toast } from 'react-hot-toast';

const StockListingForm = ({ onAddStock, isLoading = false }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    initialPrice: '',
    totalShares: '',
    volatility: '0.02'
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Symbol is required';
    } else if (!/^[A-Z]{1,5}$/.test(formData.symbol)) {
      newErrors.symbol = 'Symbol must be 1-5 uppercase letters';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }
    
    if (!formData.initialPrice || parseFloat(formData.initialPrice) <= 0) {
      newErrors.initialPrice = 'Initial price must be greater than 0';
    }
    
    if (!formData.totalShares || parseInt(formData.totalShares) <= 0) {
      newErrors.totalShares = 'Total shares must be greater than 0';
    }
    
    const vol = parseFloat(formData.volatility);
    if (!vol || vol < 0.01 || vol > 0.10) {
      newErrors.volatility = 'Volatility must be between 0.01 and 0.10';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const stockData = {
        symbol: formData.symbol.toUpperCase(),
        name: formData.name.trim(),
        price: parseFloat(formData.initialPrice),
        initialPrice: parseFloat(formData.initialPrice),
        totalShares: parseInt(formData.totalShares),
        volatility: parseFloat(formData.volatility),
        change: 0,
        changePercent: 0,
        marketCap: parseFloat(formData.initialPrice) * parseInt(formData.totalShares),
        volume: 0,
        sector: 'Custom',
        listedDate: new Date().toISOString()
      };
      
      // Call the parent component's function to add the stock
      await onAddStock(stockData);
      
      // Show success message
      toast.success(`${stockData.symbol} listed successfully!`);
      
      // Reset form
      setFormData({
        symbol: '',
        name: '',
        initialPrice: '',
        totalShares: '',
        volatility: '0.02'
      });
      
    } catch (error) {
      toast.error('Failed to list stock. Please try again.');
      console.error('Stock listing error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert symbol to uppercase automatically
    if (name === 'symbol') {
      setFormData(prev => ({
        ...prev,
        [name]: value.toUpperCase()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">List New Stock</h2>
          <p className="text-gray-600 mt-2">Add a company to the trading platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Stock Symbol */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stock Symbol *
            </label>
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              placeholder="e.g., AAPL"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.symbol ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={5}
            />
            {errors.symbol && (
              <p className="mt-1 text-sm text-red-600">{errors.symbol}</p>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Apple Inc."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Price and Shares */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Initial Price ($) *
              </label>
              <input
                type="number"
                name="initialPrice"
                value={formData.initialPrice}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.initialPrice ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.initialPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.initialPrice}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Total Shares *
              </label>
              <input
                type="number"
                name="totalShares"
                value={formData.totalShares}
                onChange={handleChange}
                min="1"
                placeholder="0"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.totalShares ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.totalShares && (
                <p className="mt-1 text-sm text-red-600">{errors.totalShares}</p>
              )}
            </div>
          </div>

          {/* Volatility */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Volatility (0.01-0.10) *
            </label>
            <input
              type="number"
              name="volatility"
              value={formData.volatility}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              max="0.10"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.volatility ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.volatility && (
              <p className="mt-1 text-sm text-red-600">{errors.volatility}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Higher volatility means more price fluctuation (0.02 = 2% daily fluctuation)
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Listing Stock...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                List Stock
              </div>
            )}
          </button>
        </form>

        {/* Info Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">About Stock Listing</h4>
          <p className="text-xs text-blue-600">
            Listed stocks will be available for trading immediately. The initial price will determine
            the starting market capitalization, and volatility will affect daily price fluctuations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockListingForm;