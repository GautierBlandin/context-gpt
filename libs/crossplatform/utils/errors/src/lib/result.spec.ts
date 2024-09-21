import { describe, expect, it } from 'vitest';
import { err, success } from './result';

describe('Result functions', () => {
  describe('success function', () => {
    it('returns an object with type "success"', () => {
      const result = success('test');
      expect(result.type).toBe('success');
    });

    it('sets the value property correctly', () => {
      const testValue = 'test';
      const result = success(testValue);
      expect(result.value).toBe(testValue);
    });

    it('does not have an error property', () => {
      const result = success('test');
      expect(result).not.toHaveProperty('error');
    });

    it('works with different data types', () => {
      expect(success(42).value).toBe(42);
      expect(success(true).value).toBe(true);
      expect(success({ key: 'value' }).value).toEqual({ key: 'value' });
    });
  });

  describe('err function', () => {
    it('returns an object with type "error"', () => {
      const result = err('error');
      expect(result.type).toBe('error');
    });

    it('sets the error property correctly', () => {
      const testError = 'test error';
      const result = err(testError);
      expect(result.error).toBe(testError);
    });

    it('does not have a value property', () => {
      const result = err('error');
      expect(result).not.toHaveProperty('value');
    });

    it('works with different data types', () => {
      expect(err(new Error('test')).error).toBeInstanceOf(Error);
      expect(err(404).error).toBe(404);
      expect(err({ message: 'error' }).error).toEqual({ message: 'error' });
    });
  });
});
