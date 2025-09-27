export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$", flag: "🇹🇼" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$", flag: "🇲🇽" },
  { code: "ARS", name: "Argentine Peso", symbol: "AR$", flag: "🇦🇷" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
  { code: "SAR", name: "Saudi Riyal", symbol: "SR", flag: "🇸🇦" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  { code: "QAR", name: "Qatari Riyal", symbol: "QR", flag: "🇶🇦" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "KD", flag: "🇰🇼" },
  { code: "BHD", name: "Bahraini Dinar", symbol: "BD", flag: "🇧🇭" },
  { code: "OMR", name: "Omani Rial", symbol: "ر.ع.", flag: "🇴🇲" },
];

// Mock exchange rates - in real app, this would come from an API
export const exchangeRates: Record<string, number> = {
  "USD": 1,
  "IDR": 16670,
  "EUR": 0.85,
  "GBP": 0.73,
  "JPY": 110,
  "CNY": 6.5,
  "AUD": 1.35,
  "CAD": 1.25,
  "CHF": 0.92,
  "SGD": 1.35,
  "MYR": 4.15,
  "THB": 33.5,
  "KRW": 1180,
  "INR": 74.5,
  "PHP": 50.8,
  "VND": 23100,
  "HKD": 7.8,
  "TWD": 27.8,
  "BRL": 5.2,
  "MXN": 20.1,
  "ARS": 99.5,
  "ZAR": 14.8,
  "RUB": 73.5,
  "TRY": 8.9,
  "SAR": 3.75,
  "AED": 3.67,
  "QAR": 3.64,
  "KWD": 0.30,
  "BHD": 0.38,
  "OMR": 0.38,
};

export const getCurrencyByCode = (code: string): Currency | undefined => {
  return currencies.find(currency => currency.code === code);
};

export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
  const fromRate = exchangeRates[fromCurrency] || 1;
  const toRate = exchangeRates[toCurrency] || 1;
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate;
  return usdAmount * toRate;
};

export const getExchangeRate = (fromCurrency: string, toCurrency: string): number => {
  const fromRate = exchangeRates[fromCurrency] || 1;
  const toRate = exchangeRates[toCurrency] || 1;
  
  return toRate / fromRate;
};