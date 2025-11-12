import { useState } from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Line, LineChart } from 'recharts';
import { format } from 'date-fns';
import { useHistoricalData } from '../hooks/useCryptoData';
import type { TimeRange } from '../types/crypto';

interface PriceChartProps {
  cryptoId: string;
  cryptoName: string;
  color?: string;
}

const timeRanges: { value: TimeRange; label: string; days: number }[] = [
  { value: '24h', label: '24H', days: 1 },
  { value: '7d', label: '7D', days: 7 },
  { value: '30d', label: '30D', days: 30 },
  { value: '1y', label: '1Y', days: 365 },
];

export default function PriceChart({ cryptoId, cryptoName }: PriceChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('7d');
  const days = timeRanges.find(r => r.value === selectedRange)?.days || 7;

  const { data: historicalData, isLoading, error } = useHistoricalData(cryptoId, days);

  const chartData = historicalData?.map(item => ({
    timestamp: item.timestamp,
    price: item.price,
    date: format(new Date(item.timestamp), selectedRange === '24h' ? 'HH:mm' : 'MMM dd')
  })) || [];

  const minPrice = Math.min(...(chartData.map(d => d.price) || [0]));
  const maxPrice = Math.max(...(chartData.map(d => d.price) || [0]));
  const priceChange = chartData.length > 0
    ? ((chartData[chartData.length - 1].price - chartData[0].price) / chartData[0].price) * 100
    : 0;

  return (
    <div className="card-flat p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-mono-200">
        <div>
          <h3 className="text-base font-semibold text-mono-900">{cryptoName}</h3>
          {chartData.length > 0 && (
            <p className={`text-sm font-medium text-mono-600`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}% ({selectedRange})
            </p>
          )}
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-1">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setSelectedRange(range.value)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors border ${
                selectedRange === range.value
                  ? 'bg-mono-900 text-white border-mono-900'
                  : 'bg-white text-mono-600 border-mono-300 hover:border-mono-900'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-mono-900 border-t-transparent animate-spin" />
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-mono-500 text-sm">
            Failed to load chart data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="date"
                stroke="#d4d4d4"
                tick={{ fill: '#737373', fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                domain={[minPrice * 0.99, maxPrice * 1.01]}
                stroke="#d4d4d4"
                tick={{ fill: '#737373', fontSize: 11 }}
                tickLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0',
                }}
                labelStyle={{ color: '#737373', fontSize: 12 }}
                itemStyle={{ color: '#000000', fontSize: 12 }}
                formatter={(value: number) => [
                  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`,
                  'Price'
                ]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#000000"
                strokeWidth={1.5}
                dot={false}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
