export const formatAmountForStripe = (amount) => {
  if (!amount || typeof amount !== 'number') {
    throw new Error('Invalid amount');
  }

  return Math.round(amount * 100);
};
