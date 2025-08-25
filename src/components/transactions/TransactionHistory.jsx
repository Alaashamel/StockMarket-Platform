import { useState } from 'react';

const PortfolioEditor = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Sample transaction data
  const transactions = [
    {
      id: 1,
      type: "deposit",
      amount: 5000000,
      date: "2025-08-25T10:30:00Z",
      status: "completed",
      symbol: null,
      quantity: null,
      price: null
    },
    {
      id: 2,
      type: "buy",
      symbol: "AAPL",
      quantity: 5,
      price: 170.25,
      amount: 851.25,
      date: "2025-08-20T14:30:00Z",
      status: "completed"
    },
    {
      id: 3,
      type: "buy",
      symbol: "MSFT",
      quantity: 3,
      price: 405.50,
      amount: 1216.50,
      date: "2025-08-18T10:15:00Z",
      status: "completed"
    },
    {
      id: 4,
      type: "buy",
      symbol: "NVDA",
      quantity: 8,
      price: 110.75,
      amount: 886.00,
      date: "2025-08-15T11:45:00Z",
      status: "completed"
    }
  ];

  // Filter transactions based on active filter
  const filteredTransactions = activeFilter === 'all' 
    ? transactions 
    : transactions.filter(transaction => transaction.type === activeFilter);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeFilter === 'all' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveFilter('buy')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeFilter === 'buy' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Buys
          </button>
          <button 
            onClick={() => setActiveFilter('sell')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeFilter === 'sell' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sells
          </button>
          <button 
            onClick={() => setActiveFilter('deposit')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeFilter === 'deposit' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Deposits
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    transaction.type === 'deposit' ? 'bg-green-100 text-green-600' : 
                    transaction.type === 'buy' ? 'bg-blue-100 text-blue-600' : 
                    'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'deposit' ? 'D' : 
                     transaction.type === 'buy' ? 'B' : 'S'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {transaction.type === 'deposit' ? 'Deposit' : 
                       `${transaction.type === 'buy' ? 'Buy' : 'Sell'} ${transaction.symbol}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className={`text-right ${
                  transaction.type === 'deposit' || transaction.type === 'sell' ? 
                  'text-green-600' : 'text-red-600'
                }`}>
                  <div className="font-semibold">
                    {transaction.type === 'deposit' || transaction.type === 'sell' ? '+' : '-'}
                    ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  {transaction.type !== 'deposit' && (
                    <div className="text-xs text-gray-500">
                      {transaction.quantity} shares @ ${transaction.price}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">No transactions found</div>
            <p className="text-gray-500 text-sm">
              No transactions match the selected filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioEditor;