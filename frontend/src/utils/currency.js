// src/utils/currency.js
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "KSH 0";
  return `KSH ${amount.toLocaleString()}`;
};

// Optional: if you need to parse or handle decimals
export const formatCurrencyWithDecimals = (amount) => {
  if (amount === undefined || amount === null) return "KSH 0.00";
  return `KSH ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
