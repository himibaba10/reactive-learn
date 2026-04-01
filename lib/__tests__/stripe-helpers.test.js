import { formatAmountForStripe } from '../stripe-helpers';

describe('stripe-helpers suite', () => {
  describe('formatAmountForStripe suite', () => {
    it('should format the amount correctly', () => {
      const amount = 100;
      const formattedAmount = formatAmountForStripe(amount);
      expect(formattedAmount).toBe(10000);
    });
    it('should throw an error if amount is not a number', () => {
      const amount = '100';
      expect(() => formatAmountForStripe(amount)).toThrow('Invalid amount');
    });
  });
});
