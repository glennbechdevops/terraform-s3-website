import { TrendingUp, TrendingDown, Plus } from 'lucide-react';
import type { CryptoData } from '../types/crypto';

interface PriceCardProps {
  crypto: CryptoData;
  onAddToPortfolio?: (cryptoId: string, price: number) => void;
}

export default function PriceCard({ crypto, onAddToPortfolio }: PriceCardProps) {
  const isPositive = crypto.price_change_percentage_24h >= 0;

  return (
    <div className="card-flat p-5 hover:border-mono-400 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 border-b border-mono-100 pb-3">
        <div>
          <h3 className="font-semibold text-base text-mono-900">{crypto.name}</h3>
          <p className="text-xs text-mono-500 uppercase tracking-wide">{crypto.symbol}</p>
        </div>
        <div className="text-xs text-mono-500 border border-mono-200 px-2 py-0.5">
          CRYPTO
        </div>
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-mono-900 mb-1 tracking-tight">
          ${crypto.current_price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: crypto.current_price < 1 ? 6 : 2
          })}
        </div>
        <div className="text-xs text-mono-500">
          USD
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium mt-2 ${
          isPositive ? 'text-mono-900' : 'text-mono-900'
        }`}>
          {isPositive ? <TrendingUp size={14} strokeWidth={2} /> : <TrendingDown size={14} strokeWidth={2} />}
          {isPositive ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-1.5 text-xs mb-4 border-t border-mono-100 pt-3">
        <div className="flex justify-between">
          <span className="text-mono-500">24H HIGH</span>
          <span className="font-medium text-mono-900">
            ${crypto.high_24h.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: crypto.high_24h < 1 ? 6 : 2
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-mono-500">24H LOW</span>
          <span className="font-medium text-mono-900">
            ${crypto.low_24h.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: crypto.low_24h < 1 ? 6 : 2
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-mono-500">MARKET CAP</span>
          <span className="font-medium text-mono-900">
            ${(crypto.market_cap / 1e9).toFixed(2)}B
          </span>
        </div>
      </div>

      {/* Add to Portfolio Button */}
      {onAddToPortfolio && (
        <button
          onClick={() => onAddToPortfolio(crypto.id, crypto.current_price)}
          className="w-full bg-mono-900 hover:bg-mono-800 text-white py-2 px-4 text-sm font-medium
                   flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={16} strokeWidth={2} />
          ADD
        </button>
      )}
    </div>
  );
}
