import { Activity, TrendingUp, Layers } from 'lucide-react';
import { useCryptoPrices } from '../hooks/useCryptoData';

export default function MarketStats() {
  const { data: cryptoData, isLoading } = useCryptoPrices();

  if (isLoading || !cryptoData) {
    return (
      <div className="card-flat p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-32 bg-mono-100 animate-pulse" />
          <div className="h-12 w-32 bg-mono-100 animate-pulse" />
          <div className="h-12 w-32 bg-mono-100 animate-pulse" />
        </div>
      </div>
    );
  }

  const totalMarketCap = cryptoData.reduce((acc, c) => acc + c.market_cap, 0);
  const totalVolume = cryptoData.reduce((acc, c) => acc + c.total_volume, 0);
  const avgChange = cryptoData.reduce((acc, c) => acc + c.price_change_percentage_24h, 0) / cryptoData.length;

  const stats = [
    {
      icon: <Layers size={18} strokeWidth={1.5} />,
      label: 'MARKET CAP',
      value: `$${(totalMarketCap / 1e9).toFixed(2)}B`,
    },
    {
      icon: <Activity size={18} strokeWidth={1.5} />,
      label: '24H VOLUME',
      value: `$${(totalVolume / 1e9).toFixed(2)}B`,
    },
    {
      icon: <TrendingUp size={18} strokeWidth={1.5} />,
      label: 'AVG CHANGE',
      value: `${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}%`,
    },
  ];

  return (
    <div className="card-flat p-4 mb-6">
      <div className="flex flex-wrap gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <div className="text-mono-600">
              {stat.icon}
            </div>
            <div>
              <div className="text-xs text-mono-500 font-medium tracking-wide">{stat.label}</div>
              <div className="text-sm font-semibold text-mono-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
