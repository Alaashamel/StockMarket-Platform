// components/company/CompanyManagement.jsx
import { useState } from 'react';

const CompanyManagement = () => {
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    initialPrice: '',
    totalShares: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call to list new stock
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">List New Stock</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Stock Symbol *</label>
          <input
            type="text"
            value={formData.symbol}
            onChange={(e) => setFormData({...formData, symbol: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="e.g., AAPL"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Company Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="e.g., Apple Inc."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Initial Price ($) *</label>
            <input
              type="number"
              value={formData.initialPrice}
              onChange={(e) => setFormData({...formData, initialPrice: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Total Shares *</label>
            <input
              type="number"
              value={formData.totalShares}
              onChange={(e) => setFormData({...formData, totalShares: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="1000000"
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
          List Stock
        </button>
      </form>
    </div>
  );
};