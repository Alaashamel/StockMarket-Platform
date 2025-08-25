import React, { useState, useEffect, useRef } from 'react';

const PerformanceAnalytics = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [performanceData, setPerformanceData] = useState([]);
  const chartRef = useRef(null);

  // Generate sample performance data
  useEffect(() => {
    const generateData = () => {
      const dataPoints = timeRange === 'week' ? 7 : 
                         timeRange === 'month' ? 30 : 90;
      
      return Array.from({ length: dataPoints }, (_, i) => ({
        value: 50 + Math.sin(i / dataPoints * Math.PI * 2) * 30 + (Math.random() * 10 - 5),
        label: timeRange === 'week' ? 
               ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] :
               `Day ${i+1}`
      }));
    };

    setPerformanceData(generateData());
  }, [timeRange]);

  // Calculate metrics
  const totalReturn = performanceData.length > 0 ? 
    ((performanceData[performanceData.length - 1].value - performanceData[0].value) / performanceData[0].value * 100).toFixed(1) : 0;
  
  const maxValue = performanceData.length > 0 ? 
    Math.max(...performanceData.map(d => d.value)).toFixed(1) : 0;
  
  const minValue = performanceData.length > 0 ? 
    Math.min(...performanceData.map(d => d.value)).toFixed(1) : 0;
  
  const avgValue = performanceData.length > 0 ? 
    (performanceData.reduce((sum, d) => sum + d.value, 0) / performanceData.length).toFixed(1) : 0;

  // Render chart using Canvas API directly
  useEffect(() => {
    if (!chartRef.current || performanceData.length === 0) return;
    
    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Calculate dimensions
    const padding = { top: 20, right: 30, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Find data range for scaling
    const values = performanceData.map(d => d.value);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const valRange = maxVal - minVal;
    
    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      
      // Y-axis labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText((maxVal - (valRange / 4) * i).toFixed(0), padding.left - 10, y + 4);
    }
    
    // Draw the performance line
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#3b82f6';
    
    performanceData.forEach((data, i) => {
      const x = padding.left + (chartWidth / (performanceData.length - 1)) * i;
      const y = padding.top + chartHeight - ((data.value - minVal) / valRange) * chartHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw data points
    performanceData.forEach((data, i) => {
      const x = padding.left + (chartWidth / (performanceData.length - 1)) * i;
      const y = padding.top + chartHeight - ((data.value - minVal) / valRange) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
    });
    
    // Draw X-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    // Show fewer labels for better readability
    const labelStep = Math.ceil(performanceData.length / 10);
    
    performanceData.forEach((data, i) => {
      if (i % labelStep === 0 || i === performanceData.length - 1) {
        const x = padding.left + (chartWidth / (performanceData.length - 1)) * i;
        ctx.fillText(data.label, x, height - 10);
      }
    });
    
  }, [performanceData]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
          Performance Analytics
        </h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button 
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              timeRange === 'week' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              timeRange === 'month' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              timeRange === 'quarter' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setTimeRange('quarter')}
          >
            Quarter
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Total Return</div>
          <div className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalReturn >= 0 ? '+' : ''}{totalReturn}%
          </div>
          <div className="flex items-center mt-1">
            <div className={`text-xs ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalReturn >= 0 ? '↗ Up' : '↘ Down'} from previous period
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Avg. Performance</div>
          <div className="text-2xl font-bold text-gray-800">{avgValue}%</div>
          <div className="text-xs text-gray-400 mt-1">Daily average</div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Peak</div>
          <div className="text-2xl font-bold text-gray-800">{maxValue}%</div>
          <div className="text-xs text-gray-400 mt-1">Highest value</div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Low</div>
          <div className="text-2xl font-bold text-gray-800">{minValue}%</div>
          <div className="text-xs text-gray-400 mt-1">Lowest value</div>
        </div>
      </div>
      
      <div className="h-80 relative">
        <canvas 
          ref={chartRef} 
          width={600} 
          height={320}
          className="w-full h-full"
        ></canvas>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;