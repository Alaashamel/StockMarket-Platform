import { useState, useEffect, useRef } from "react";

const TickerTape = () => {
  const [stocks, setStocks] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef(null);

  useEffect(() => {
    // Mock stock data
    const mockStocks = [
      { symbol: "AAPL", price: 176.08, change: 1.24, changePercent: 0.71, name: "Apple Inc." },
      { symbol: "MSFT", price: 337.69, change: -0.56, changePercent: -0.17, name: "Microsoft" },
      { symbol: "GOOGL", price: 138.21, change: 2.31, changePercent: 1.7, name: "Alphabet" },
      { symbol: "AMZN", price: 142.07, change: -1.15, changePercent: -0.8, name: "Amazon" },
      { symbol: "TSLA", price: 209.14, change: 3.42, changePercent: 1.66, name: "Tesla" },
      { symbol: "NVDA", price: 431.04, change: 4.27, changePercent: 1.0, name: "NVIDIA" },
      { symbol: "META", price: 310.87, change: -0.73, changePercent: -0.23, name: "Meta" },
      { symbol: "JPM", price: 168.32, change: 0.89, changePercent: 0.53, name: "JPMorgan" },
      { symbol: "V", price: 240.15, change: 1.25, changePercent: 0.52, name: "Visa" },
      { symbol: "JNJ", price: 152.34, change: 0.45, changePercent: 0.3, name: "Johnson & Johnson" },
      { symbol: "XOM", price: 118.72, change: 2.31, changePercent: 1.98, name: "Exxon Mobil" },
      { symbol: "BTC-USD", price: 51234.56, change: 1234.56, changePercent: 2.47, name: "Bitcoin" },
    ];
    setStocks(mockStocks);

    // Simulate real-time data updates
    const interval = setInterval(() => {
      if (!isPaused) {
        setStocks((prevStocks) =>
          prevStocks.map((stock) => {
            const randomChange = (Math.random() - 0.5) / 2;
            const newPrice = stock.price * (1 + randomChange / 100);
            const change = newPrice - stock.price;
            const changePercent = (change / stock.price) * 100;

            return {
              ...stock,
              price: newPrice,
              change: change,
              changePercent: changePercent,
            };
          })
        );
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleTickerHover = () => {
    setIsPaused(true);
  };

  const handleTickerLeave = () => {
    setIsPaused(false);
  };

  return (
    <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <span className="text-orange-400 font-bold text-sm mr-4">LIVE</span>
          <span className="text-gray-300 text-xs hidden md:block">Market Updates</span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onMouseEnter={handleTickerHover}
            onMouseLeave={handleTickerLeave}
            className="text-gray-400 hover:text-gray-200 text-xs transition-colors"
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
          <div className="text-gray-400 text-xs">{new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      <div
        ref={tickerRef}
        className="overflow-hidden py-2 relative"
        onMouseEnter={handleTickerHover}
        onMouseLeave={handleTickerLeave}
      >
        <div
          className={`whitespace-nowrap inline-block ${isPaused ? "animate-none" : "animate-marquee"}`}
          style={{ animationDuration: "40s" }}
        >
          {stocks.map((stock, index) => (
            <div
              key={`${stock.symbol}-${index}`}
              className="mx-6 inline-flex items-center space-x-4 group cursor-pointer"
              title={stock.name}
            >
              <div className="flex items-center space-x-2 min-w-[120px]">
                <span className="font-semibold text-white text-sm">{stock.symbol}</span>
                <span className="text-gray-300 text-sm">${stock.price.toFixed(2)}</span>
              </div>

              <div
                className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded ${
                  stock.change >= 0 ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"
                }`}
              >
                <span>{stock.change >= 0 ? "▲" : "▼"}</span>
                <span>{Math.abs(stock.change).toFixed(2)}</span>
                <span>({stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%)</span>
              </div>

              {/* Hover tooltip */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded border border-gray-600 whitespace-nowrap">
                  {stock.name}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>
      </div>

      {/* Remove the style jsx tag and use CSS classes instead */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default TickerTape;