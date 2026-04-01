import { formatPrice } from '../formatPrice';

describe('formatPrice utility', () => {
  it('formats a whole number correctly as BDT currency', () => {
    const result = formatPrice(1500);
    expect(result).toMatch(/1,500/);
    expect(result).toMatch(/BDT/i);
  });

  it('formats a decimal number correctly', () => {
    const result = formatPrice(10.5);
    expect(result).toMatch(/10\.50/);
  });

  it('handles zero correctly', () => {
    const result = formatPrice(0);
    expect(result).toMatch(/0\.00/);
  });

  it('throws error if the number is negative', () => {
    expect(() => formatPrice(-100)).toThrow('Price cannot be negative');
  });
});
