import { formatDate } from '../formatDate';

describe('formatDate utility', () => {
  it('should return correct format date', () => {
    const result = formatDate('2026-02-01');
    expect(result).toBe('Feb 1, 2026');
  });

  it('should throw error if the date is invalid', () => {
    expect(() => formatDate('hello')).toThrow('"hello" is not a valid date.');
  });
});
