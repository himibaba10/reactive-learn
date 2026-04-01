const { calculateModuleProgress } = require('../module-helpers');

describe('module helpers suite', () => {
  describe('calculateModuleProgress function', () => {
    it('should calculate module progress', () => {
      const completedModules = 1;
      const totalModules = 2;
      const result = calculateModuleProgress(completedModules, totalModules);
      expect(result).toBe(50);
    });

    it('should return 0 if totalModules is 0', () => {
      const completedModules = 1;
      const totalModules = 0;
      const result = calculateModuleProgress(completedModules, totalModules);
      expect(result).toBe(0);
    });

    it('should throw an error if completedModules is greater than totalModules', () => {
      const completedModules = 2;
      const totalModules = 1;
      expect(() => calculateModuleProgress(completedModules, totalModules)).toThrow('completedModules can not be greater than totalModules');
    });

    it('should throw an error if completedModules is less than 0', () => {
      const completedModules = -1;
      const totalModules = 2;
      expect(() => calculateModuleProgress(completedModules, totalModules)).toThrow('completedModules and totalModules can not be less than 0');
    });

    it('should throw an error if totalModules is less than 0', () => {
      const completedModules = 1;
      const totalModules = -2;
      expect(() => calculateModuleProgress(completedModules, totalModules)).toThrow('completedModules and totalModules can not be less than 0');
    });

    it('should throw an error if completedModules is not a number', () => {
      const completedModules = '1';
      const totalModules = 2;
      expect(() => calculateModuleProgress(completedModules, totalModules)).toThrow('calculateModuleProgress function error: Expected a number');
    });

    it('should throw an error if totalModules is not a number', () => {
      const completedModules = 1;
      const totalModules = '2';
      expect(() => calculateModuleProgress(completedModules, totalModules)).toThrow('calculateModuleProgress function error: Expected a number');
    });

    it('should return 100 if completedModules is equal to totalModules', () => {
      const completedModules = 2;
      const totalModules = 2;
      const result = calculateModuleProgress(completedModules, totalModules);
      expect(result).toBe(100);
    });
  });
});
