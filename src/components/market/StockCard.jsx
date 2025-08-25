const StockCard = ({ stock }) => {
  const isPositive = stock.change >= 0;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{stock.symbol}</h3>
          <p className="text-sm text-gray-600">{stock.name}</p>
        </div>
        <div className={`flex items-center px-2 py-1 rounded-md ${
          isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <span className="text-sm font-medium">
            {isPositive ? '+' : ''}{stock.change.toFixed(2)}%
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Price:</span>
          <span className="text-lg font-semibold text-gray-800">${stock.price.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Volume:</span>
          <span className="text-sm font-medium text-gray-700">{stock.volume}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Last updated: Just now</span>
          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockCard;