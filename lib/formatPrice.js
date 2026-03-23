export const formatPrice = (amount) => {
  return Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
  }).format(amount);
};
