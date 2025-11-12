import { useQuery } from '@tanstack/react-query';
import { fetchCryptoNews } from '../services/api';

export const useCryptoNews = () => {
  return useQuery({
    queryKey: ['cryptoNews'],
    queryFn: fetchCryptoNews,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};
