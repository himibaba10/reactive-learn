export const formatPrice = (amount) => {
  if (amount < 0) throw new Error('Price cannot be negative');

  return Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
  }).format(amount);
};
