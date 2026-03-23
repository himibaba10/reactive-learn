export const formatAmountForStripe = (amount) => {
  const numberFormat = Intl.NumberFormat(['en-BD'], {
    style: 'currency',
    currency: 'BDT',
  });

  const parts = numberFormat.formatToParts(amount);

  let zeroDecimalCurrency = true;
  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }

  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
};
