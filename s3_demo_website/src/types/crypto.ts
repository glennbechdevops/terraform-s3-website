export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  body: string;
  url: string;
  source: string;
  imageurl: string;
  published_on: number;
  categories: string;
}

export interface HistoricalPrice {
  timestamp: number;
  price: number;
}

export interface Portfolio {
  [cryptoId: string]: {
    amount: number;
    averagePrice: number;
  };
}

export type TimeRange = '24h' | '7d' | '30d' | '1y';

export const CRYPTO_BEVERAGES = {
  bitcoin: {
    id: 'bitcoin',
    name: 'Bitcoin Brew',
    symbol: 'BTC',
    color: '#F7931A',
    description: 'The OG crypto juice'
  },
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum Elixir',
    symbol: 'ETH',
    color: '#627EEA',
    description: 'Smart contract smoothie'
  },
  cardano: {
    id: 'cardano',
    name: 'Cardano Cocktail',
    symbol: 'ADA',
    color: '#0033AD',
    description: 'Proof-of-stake potion'
  },
  solana: {
    id: 'solana',
    name: 'Solana Soda',
    symbol: 'SOL',
    color: '#14F195',
    description: 'High-speed hydration'
  },
  ripple: {
    id: 'ripple',
    name: 'XRP Xtreme',
    symbol: 'XRP',
    color: '#23292F',
    description: 'Banking blend'
  },
  polkadot: {
    id: 'polkadot',
    name: 'Polkadot Punch',
    symbol: 'DOT',
    color: '#E6007A',
    description: 'Interoperability infusion'
  },
  dogecoin: {
    id: 'dogecoin',
    name: 'Doge Drink',
    symbol: 'DOGE',
    color: '#C2A633',
    description: 'Much wow, very refresh'
  },
} as const;
