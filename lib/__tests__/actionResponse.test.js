import { actionError, actionSuccess } from '../actionResponse';

describe('actionSuccess utility', () => {
  it('should return correct format response without message', () => {
    const result = actionSuccess('hello');
    expect(result).toEqual({ success: true, data: 'hello' });
  });

  it('should return correct format response with message', () => {
    const result = actionSuccess('hello', 'success');
    expect(result).toEqual({ success: true, data: 'hello', message: 'success' });
  });

  it('should return correct format response with null data', () => {
    const result = actionSuccess(null);
    expect(result).toEqual({ success: true });
  });

  it('should return correct format response with undefined data', () => {
    const result = actionSuccess(undefined);
    expect(result).toEqual({ success: true });
  });
});

describe('actionError utility', () => {
  it('should return correct format response with error message', () => {
    const result = actionError('error');
    expect(result).toEqual({ success: false, error: 'error', statusCode: 500 });
  });

  it('should return correct format response with error object', () => {
    const result = actionError(new Error('thrown error'));
    expect(result).toEqual({ success: false, error: 'thrown error', statusCode: 500 });
  });

  it('should return correct format response with error object and status code', () => {
    const result = actionError(new Error('thrown error'), 400);
    expect(result).toEqual({ success: false, error: 'thrown error', statusCode: 400 });
  });
});
