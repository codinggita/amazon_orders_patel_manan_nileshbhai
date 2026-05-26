/**
 * Maps friendly sort query values to MongoDB field names
 */
const SORT_ALIASES = {
  amount: 'TotalAmount',
  date: 'OrderDate',
  status: 'OrderStatus',
  customer: 'CustomerName',
  city: 'City',
  payment: 'PaymentMethod',
  quantity: 'Quantity',
  discount: 'Discount',
  created: 'createdAt',
  items: 'Quantity',
};

/**
 * Preset sorts for dedicated /orders/sort/* routes
 */
export const SORT_PRESETS = {
  'highest-value': '-TotalAmount',
  'lowest-value': 'TotalAmount',
  latest: '-OrderDate',
  oldest: 'OrderDate',
  'most-items': '-Quantity',
  'least-items': 'Quantity',
  discount: '-Discount',
};

export const ALLOWED_SORT_KEYS = [
  ...Object.keys(SORT_ALIASES),
  ...Object.keys(SORT_PRESETS),
  'TotalAmount',
  'OrderDate',
  'OrderStatus',
  'CustomerName',
  'City',
  'PaymentMethod',
  'Quantity',
  'Discount',
  'createdAt',
];

/**
 * Convert ?sort=amount or ?sort=-date to MongoDB sort string
 * @param {string} sort - Query sort parameter
 * @returns {string} MongoDB sort field (e.g. '-TotalAmount')
 */
export function resolveSortParam(sort) {
  if (!sort) {
    return '-createdAt';
  }

  const trimmed = String(sort).trim();

  if (SORT_PRESETS[trimmed]) {
    return SORT_PRESETS[trimmed];
  }

  const desc = trimmed.startsWith('-');
  const key = desc ? trimmed.slice(1) : trimmed;
  const normalizedKey = key.toLowerCase();
  const mongoField = SORT_ALIASES[normalizedKey] || SORT_ALIASES[key] || key;

  return desc ? `-${mongoField}` : mongoField;
}

/**
 * Validate sort key (without leading minus)
 */
export function isValidSortKey(key) {
  const normalized = key.toLowerCase();
  return (
    ALLOWED_SORT_KEYS.some((k) => k.toLowerCase() === normalized) ||
    SORT_PRESETS[key] !== undefined
  );
}
