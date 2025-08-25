// components/user/BalanceCard.jsx
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const BalanceCard = ({ 
  cashBalance, 
  investedValue, 
  totalValue, 
  dailyChange, 
  onDeposit,
  onTransactionUpdate 
}) => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(depositAmount) || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid deposit amount');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const amount = parseFloat(depositAmount);
      
      // Call the parent component's deposit handler
      if (onDeposit) {
        onDeposit(amount);
      }
      
      // Notify about transaction update
      if (onTransactionUpdate) {
        onTransactionUpdate({
          type: 'deposit',
          amount,
          date: new Date().toISOString(),
          status: 'completed'
        });
      }
      
      // Show success toast
      toast.success(`Successfully deposited $${amount.toFixed(2)}`);
      
      // Reset form
      setDepositAmount('');
      setShowDepositModal(false);
    } catch (error) {
      console.error('Deposit failed:', error);
      toast.error('Deposit failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickDeposit = (amount) => {
    setDepositAmount(amount.toString());
  };

  return (
    <>
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl text-white overflow-hidden p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold">Portfolio Value</h2>
            <p className="text-blue-100 text-sm mt-1">Real-time performance</p>
          </div>
          <button
            onClick={() => setShowDepositModal(true)}
            className="bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            Deposit
          </button>
        </div>

        {/* Main Portfolio Value */}
        <div className="mb-6">
          <div className="flex items-end gap-2">
            <span className="text-3xl md:text-4xl font-bold">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`flex items-center text-lg font-medium mb-1 ${
              dailyChange >= 0 ? 'text-green-300' : 'text-red-300'
            }`}>
              {dailyChange >= 0 ? '↗' : '↘'}
              ${Math.abs(dailyChange).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center text-blue-100 text-sm mt-2">
            <i className="fas fa-wallet mr-2"></i>
            <span>${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} available cash</span>
          </div>
        </div>

        {/* Allocation Progress Bar */}
        {totalValue > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-blue-100 mb-2">
              <span>Cash: {((cashBalance / totalValue) * 100).toFixed(1)}%</span>
              <span>Invested: {((investedValue / totalValue) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${(investedValue / totalValue) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Deposit Funds</h3>
            <p className="text-gray-500 text-sm mb-6">Add funds to your investment account</p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount to Deposit
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 text-lg">$</span>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isProcessing}
                />
              </div>
              
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[100, 500, 1000, 5000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => handleQuickDeposit(amount)}
                    className="py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDepositAmount('');
                  setShowDepositModal(false);
                }}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                disabled={isProcessing || !depositAmount}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Processing...
                  </>
                ) : (
                  'Deposit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BalanceCard;