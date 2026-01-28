'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const CurrencyContext = createContext();

export const currencies = [
  { code: 'PKR', symbol: 'Rs.', name: 'Pakistani Rupee', rate: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.0036 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.0033 },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rate: 0.013 },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', rate: 0.0135 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.0028 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 0.026 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 0.30 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 0.53 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 0.0048 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 0.0055 },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', rate: 0.0031 },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', rate: 0.32 },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', rate: 0.11 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 0.0048 },
];

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(currencies[0]);

  useEffect(() => {
    const savedCurrencyCode = localStorage.getItem('currency');
    if (savedCurrencyCode) {
      const savedCurrency = currencies.find(c => c.code === savedCurrencyCode);
      if (savedCurrency) {
        setCurrency(savedCurrency);
      }
    }
  }, []);

  const updateCurrency = (code) => {
    const newCurrency = currencies.find(c => c.code === code);
    if (newCurrency) {
      setCurrency(newCurrency);
      localStorage.setItem('currency', code);
    }
  };

  const convertAmount = (amountInPKR) => {
    if (amountInPKR === undefined || amountInPKR === null) return 0;
    // Remove any non-numeric characters if input is string (e.g. "Rs. 500")
    const cleanAmount = typeof amountInPKR === 'string'
      ? parseFloat(amountInPKR.replace(/[^0-9.]/g, ''))
      : amountInPKR;

    return cleanAmount * currency.rate;
  };

  const formatAmount = (amountInPKR, showSymbol = true) => {
    const converted = convertAmount(amountInPKR);
    // Format logic:
    // If rate < 0.1 (strong currencies like USD/EUR), show 2 decimal places always
    // If rate >= 0.1 (weaker currencies like INR/JPY/PKR), show 0 decimals for whole numbers, 2 otherwise

    // Actually, let's keep it simple: 2 decimal places for everything except PKR and whole numbers
    const formattedNumber = converted.toLocaleString(undefined, {
      minimumFractionDigits: currency.code === 'PKR' ? 0 : 2,
      maximumFractionDigits: 2
    });

    return showSymbol ? `${currency.symbol} ${formattedNumber}` : formattedNumber;
  };

  return (
    <CurrencyContext.Provider value={{ currency, currencies, setCurrency: updateCurrency, convertAmount, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
