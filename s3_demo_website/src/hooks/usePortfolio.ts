import { useState, useEffect } from 'react';
import type { Portfolio } from '../types/crypto';

const STORAGE_KEY = 'crypto-juice-portfolio';

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<Portfolio>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
  }, [portfolio]);

  const addToPortfolio = (cryptoId: string, amount: number, price: number) => {
    setPortfolio(prev => {
      const existing = prev[cryptoId];
      if (existing) {
        const totalAmount = existing.amount + amount;
        const totalValue = (existing.amount * existing.averagePrice) + (amount * price);
        return {
          ...prev,
          [cryptoId]: {
            amount: totalAmount,
            averagePrice: totalValue / totalAmount
          }
        };
      }
      return {
        ...prev,
        [cryptoId]: { amount, averagePrice: price }
      };
    });
  };

  const removeFromPortfolio = (cryptoId: string) => {
    setPortfolio(prev => {
      const newPortfolio = { ...prev };
      delete newPortfolio[cryptoId];
      return newPortfolio;
    });
  };

  return { portfolio, addToPortfolio, removeFromPortfolio };
};
