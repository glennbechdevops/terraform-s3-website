import { useQuery } from '@tanstack/react-query';
import { fetchCryptoPrices, fetchHistoricalData } from '../services/api';

export const useCryptoPrices = () => {
  return useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: fetchCryptoPrices,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useHistoricalData = (cryptoId: string, days: number) => {
  return useQuery({
    queryKey: ['historicalData', cryptoId, days],
    queryFn: () => fetchHistoricalData(cryptoId, days),
    enabled: !!cryptoId,
  });
};
