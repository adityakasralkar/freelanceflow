// Supported ISO 4217 currency codes for FreelanceFlow.
// Keep in sync with frontend dropdown options.
const SUPPORTED_CURRENCIES = [
  'INR', // Indian Rupee
  'USD', // US Dollar
  'EUR', // Euro
  'GBP', // British Pound
  'AUD', // Australian Dollar
  'CAD', // Canadian Dollar
  'AED', // UAE Dirham
  'SGD', // Singapore Dollar
  'JPY', // Japanese Yen
  'CHF', // Swiss Franc
  'CNY', // Chinese Yuan
  'HKD', // Hong Kong Dollar
  'NZD', // New Zealand Dollar
  'ZAR', // South African Rand
  'SEK', // Swedish Krona
];

const DEFAULT_CURRENCY = 'INR';

module.exports = { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY };
