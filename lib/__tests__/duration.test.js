const { durationToSeconds, secondsToDuration } = require('../duration');

describe('duration suite', () => {
  describe('durationToSeconds function', () => {
    it('should convert 01:00 duration to seconds', () => {
      const duration = '01:00';
      const result = durationToSeconds(duration);
      expect(result).toBe(60);
    });

    it('should convert 01:00:00 duration to seconds', () => {
      const duration = '01:00:00';
      const result = durationToSeconds(duration);
      expect(result).toBe(3600);
    });

    it('should throw error if input is not a string', () => {
      const duration = 123;
      expect(() => durationToSeconds(duration)).toThrow('durationToSeconds function error: Expected a string');
    });
  });

  describe('secondsToDuration function', () => {
    it('should convert 60 seconds to duration', () => {
      const seconds = 60;
      const result = secondsToDuration(seconds);
      expect(result).toBe('01:00');
    });

    it('should convert 3600 seconds to duration', () => {
      const seconds = 3600;
      const result = secondsToDuration(seconds);
      expect(result).toBe('01:00:00');
    });

    it('should throw error if input is not a number', () => {
      const seconds = '60';
      expect(() => secondsToDuration(seconds)).toThrow('secondsToDuration function error: Expected a number');
    });
  });
});
