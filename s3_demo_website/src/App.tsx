import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Newspaper, Wallet, BarChart3, Database } from 'lucide-react';
import PriceCard from './components/PriceCard';
import PriceChart from './components/PriceChart';
import NewsCard from './components/NewsCard';
import Portfolio from './components/Portfolio';
import MarketStats from './components/MarketStats';
import { useCryptoPrices } from './hooks/useCryptoData';
import { useCryptoNews } from './hooks/useCryptoNews';
import { usePortfolio } from './hooks/usePortfolio';
import { CRYPTO_BEVERAGES } from './types/crypto';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

type Tab = 'prices' | 'charts' | 'news' | 'portfolio';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('prices');
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');

  const { data: cryptoData, isLoading: isPricesLoading } = useCryptoPrices();
  const { data: newsData, isLoading: isNewsLoading } = useCryptoNews();
  const { addToPortfolio } = usePortfolio();

  const tabs = [
    { id: 'prices' as Tab, label: 'Market Prices', icon: <TrendingUp size={18} /> },
    { id: 'charts' as Tab, label: 'Charts', icon: <BarChart3 size={18} /> },
    { id: 'news' as Tab, label: 'News', icon: <Newspaper size={18} /> },
    { id: 'portfolio' as Tab, label: 'Holdings', icon: <Wallet size={18} /> },
  ];

  const handleAddToPortfolio = (cryptoId: string, price: number) => {
    addToPortfolio(cryptoId, 1, price);
    setActiveTab('portfolio');
  };

  return (
    <div className="min-h-screen bg-mono-50">
      <div className="relative">
        {/* Header */}
        <header className="border-b border-mono-200 bg-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Database size={32} className="text-mono-900" strokeWidth={1.5} />
                <div>
                  <h1 className="text-2xl font-bold text-mono-900 tracking-tight">
                    CRYPTO JUICE EXCHANGE
                  </h1>
                  <p className="text-xs text-mono-500 uppercase tracking-wide">
                    Live Crypto Prices & News
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 border border-mono-200 px-3 py-1.5 text-xs text-mono-600">
                <span className="w-1.5 h-1.5 bg-mono-900 inline-block" />
                AWS S3 + Terraform
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-0 mb-8 border-b border-mono-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 font-medium text-sm flex items-center gap-2 transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-mono-900 text-mono-900'
                    : 'border-transparent text-mono-500 hover:text-mono-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {activeTab === 'prices' && (
              <motion.div
                key="prices"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MarketStats />

                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-4 text-mono-900 uppercase tracking-wide">
                    Spot Prices
                  </h2>

                  {isPricesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="card-flat p-6 h-48 bg-mono-100 animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cryptoData?.map((crypto) => (
                        <PriceCard
                          key={crypto.id}
                          crypto={crypto}
                          onAddToPortfolio={handleAddToPortfolio}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'charts' && (
              <motion.div
                key="charts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-lg font-semibold mb-4 text-mono-900 uppercase tracking-wide">
                  Historical Charts
                </h2>

                {/* Crypto Selector */}
                <div className="card-flat p-4 mb-6 flex flex-wrap gap-2">
                  {Object.entries(CRYPTO_BEVERAGES).map(([id, crypto]) => (
                    <button
                      key={id}
                      onClick={() => setSelectedCrypto(id)}
                      className={`px-4 py-2 text-sm font-medium transition-all border ${
                        selectedCrypto === id
                          ? 'bg-mono-900 text-white border-mono-900'
                          : 'bg-white text-mono-600 border-mono-300 hover:border-mono-900'
                      }`}
                    >
                      {crypto.name}
                    </button>
                  ))}
                </div>

                <PriceChart
                  cryptoId={selectedCrypto}
                  cryptoName={CRYPTO_BEVERAGES[selectedCrypto as keyof typeof CRYPTO_BEVERAGES]?.name}
                  color={CRYPTO_BEVERAGES[selectedCrypto as keyof typeof CRYPTO_BEVERAGES]?.color || "#000000"}
                />
              </motion.div>
            )}

            {activeTab === 'news' && (
              <motion.div
                key="news"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-lg font-semibold mb-4 text-mono-900 uppercase tracking-wide">
                  Market News
                </h2>

                {isNewsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="card-flat p-4 h-24 bg-mono-100 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {newsData?.map((article, index) => (
                      <NewsCard key={article.id} article={article} index={index} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'portfolio' && (
              <motion.div
                key="portfolio"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-lg font-semibold mb-4 text-mono-900 uppercase tracking-wide">
                  Portfolio Holdings
                </h2>

                <Portfolio />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="border-t border-mono-200 bg-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-mono-500">
              <div>
                React • TypeScript • Tailwind CSS • Recharts
              </div>
              <div>
                Terraform • AWS S3 • Infrastructure as Code
              </div>
              <div>
                Data: CoinGecko & CryptoCompare APIs
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
