import { Trash2, TrendingUp, TrendingDown, Package } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { useCryptoPrices } from '../hooks/useCryptoData';

export default function Portfolio() {
  const { portfolio, removeFromPortfolio } = usePortfolio();
  const { data: cryptoData } = useCryptoPrices();

  const portfolioEntries = Object.entries(portfolio);
  const hasItems = portfolioEntries.length > 0;

  const totalValue = portfolioEntries.reduce((sum, [cryptoId, holding]) => {
    const crypto = cryptoData?.find(c => c.id === cryptoId);
    const currentPrice = crypto?.current_price || 0;
    return sum + (holding.amount * currentPrice);
  }, 0);

  const totalCost = portfolioEntries.reduce((sum, [, holding]) => {
    return sum + (holding.amount * holding.averagePrice);
  }, 0);

  const totalProfit = totalValue - totalCost;
  const totalProfitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
  const isProfit = totalProfit >= 0;

  if (!hasItems) {
    return (
      <div className="card-flat p-8 text-center">
        <Package size={48} className="mx-auto mb-4 text-mono-400" strokeWidth={1.5} />
        <h3 className="text-lg font-semibold mb-2 text-mono-900">No Holdings</h3>
        <p className="text-sm text-mono-500">
          Add cryptocurrencies to your portfolio to track performance
        </p>
      </div>
    );
  }

  return (
    <div className="card-flat p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-mono-200">
        <div>
          <h3 className="text-lg font-semibold text-mono-900">Total Value</h3>
          <p className="text-xs text-mono-500 uppercase tracking-wide">Portfolio Summary</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-mono-900 tracking-tight">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`flex items-center justify-end gap-1 text-sm font-medium ${
            isProfit ? 'text-mono-900' : 'text-mono-900'
          }`}>
            {isProfit ? <TrendingUp size={14} strokeWidth={2} /> : <TrendingDown size={14} strokeWidth={2} />}
            {isProfit ? '+' : ''}{totalProfit.toFixed(2)} ({totalProfitPercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div className="space-y-3">
        {portfolioEntries.map(([cryptoId, holding]) => {
          const crypto = cryptoData?.find(c => c.id === cryptoId);

          if (!crypto) return null;

          const currentValue = holding.amount * crypto.current_price;
          const costBasis = holding.amount * holding.averagePrice;
          const profit = currentValue - costBasis;
          const profitPercent = (profit / costBasis) * 100;
          const isProfitable = profit >= 0;

          return (
            <div
              key={cryptoId}
              className="border border-mono-200 p-4 hover:border-mono-900 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-mono-900">{crypto.name}</h4>
                  <p className="text-xs text-mono-500">
                    {holding.amount} {crypto.symbol} @ ${holding.averagePrice.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromPortfolio(cryptoId)}
                  className="text-mono-400 hover:text-mono-900 transition-colors"
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs text-mono-500 mb-1">CURRENT VALUE</div>
                  <div className="text-lg font-bold text-mono-900">
                    ${currentValue.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-mono-500 mb-1">P/L</div>
                  <div className={`text-sm font-medium ${isProfitable ? 'text-mono-900' : 'text-mono-900'}`}>
                    {isProfitable ? '+' : ''}{profit.toFixed(2)} ({profitPercent.toFixed(1)}%)
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
