import axios from 'axios';
import type { CryptoData, NewsArticle, HistoricalPrice } from '../types/crypto';
import { CRYPTO_BEVERAGES } from '../types/crypto';

// CoinGecko API - No API key required!
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const CRYPTOCOMPARE_API = 'https://min-api.cryptocompare.com/data/v2';

// Fetch cryptocurrency prices from CoinGecko
export const fetchCryptoPrices = async (): Promise<CryptoData[]> => {
  try {
    const cryptoIds = Object.keys(CRYPTO_BEVERAGES).join(',');

    const response = await axios.get(
      `${COINGECKO_API}/coins/markets`,
      {
        params: {
          vs_currency: 'usd',
          ids: cryptoIds,
          order: 'market_cap_desc',
          per_page: 10,
          page: 1,
          sparkline: false,
        },
      }
    );

    return response.data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: CRYPTO_BEVERAGES[coin.id as keyof typeof CRYPTO_BEVERAGES]?.name || coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      high_24h: coin.high_24h,
      low_24h: coin.low_24h,
      market_cap: coin.market_cap,
      total_volume: coin.total_volume,
      image: coin.image,
    }));
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    throw error;
  }
};

// Fetch historical data from CoinGecko
export const fetchHistoricalData = async (
  cryptoId: string,
  days: number
): Promise<HistoricalPrice[]> => {
  try {
    const response = await axios.get(
      `${COINGECKO_API}/coins/${cryptoId}/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: days === 1 ? 1 : days === 7 ? 7 : days === 30 ? 30 : 365,
          interval: days === 1 ? 'hourly' : 'daily',
        },
      }
    );

    return response.data.prices.map((price: [number, number]) => ({
      timestamp: price[0],
      price: price[1],
    }));
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};

// Fetch crypto news from CryptoCompare
export const fetchCryptoNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await axios.get(
      `${CRYPTOCOMPARE_API}/news/?lang=EN`
    );

    if (!response.data.Data) {
      return [];
    }

    return response.data.Data.slice(0, 10).map((article: any) => ({
      id: article.id,
      title: article.title,
      body: article.body,
      url: article.url,
      source: article.source,
      imageurl: article.imageurl,
      published_on: article.published_on,
      categories: article.categories,
    }));
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    // Return fallback news if API fails
    return [
      {
        id: '1',
        title: 'Bitcoin reaches new milestone in adoption',
        body: 'Major institutions continue to embrace cryptocurrency as a legitimate asset class.',
        url: '#',
        source: 'Crypto Daily',
        imageurl: '',
        published_on: Date.now() / 1000,
        categories: 'BTC'
      },
      {
        id: '2',
        title: 'Ethereum upgrade brings major improvements',
        body: 'Network enhancements lead to faster transactions and lower fees.',
        url: '#',
        source: 'Blockchain News',
        imageurl: '',
        published_on: Date.now() / 1000,
        categories: 'ETH'
      },
      {
        id: '3',
        title: 'Cryptocurrency market shows strong momentum',
        body: 'Trading volumes surge as investor interest reaches new highs.',
        url: '#',
        source: 'Market Watch',
        imageurl: '',
        published_on: Date.now() / 1000,
        categories: 'Trading'
      }
    ];
  }
};
