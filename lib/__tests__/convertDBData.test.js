import { replaceMongoIdInArray, replaceMongoIdInObject } from '../convertDBData';

describe('convertDBData suite', () => {
  describe('replaceMongoIdInArray function', () => {
    it('should replace mongo _id with id in array', () => {
      const array = [{ _id: '1', name: 'test' }];
      const result = replaceMongoIdInArray(array);
      expect(result).toEqual([{ _id: '1', id: '1', name: 'test' }]);
    });

    it('should throw error if input is not an array', () => {
      const array = { _id: '1', name: 'test' };
      expect(() => replaceMongoIdInArray(array)).toThrow('replaceMongoIdInArray function error: Expected an array');
    });
  });

  describe('replaceMongoIdInObject function', () => {
    it('should replace mongo _id with id in object', () => {
      const obj = { _id: '1', name: 'test' };
      const result = replaceMongoIdInObject(obj);
      expect(result).toEqual({ _id: '1', id: '1', name: 'test' });
    });

    it('should return null if input is null', () => {
      const obj = null;
      const result = replaceMongoIdInObject(obj);
      expect(result).toBeNull();
    });

    it('should throw error if input is not an object', () => {
      const obj = 'test';
      expect(() => replaceMongoIdInObject(obj)).toThrow('replaceMongoIdInObject function error: Expected an object');
    });
  });
});
