import { describe, beforeEach, it, expect } from 'vitest';
import { get as getCookie, set as setCookie, clear as clearCookieStore } from '../lib/index';
import * as z from 'zod';

describe('Number Cookies', () => {
  describe('set', () => {
    beforeEach(() => {
      clearCookieStore();
      expect(document.cookie).toBe('');
    });

    it('a positive number', () => {
      setCookie('count', 42);
      expect(document.cookie).toBe('count=42');
    });

    it('a negative number', () => {
      setCookie('offset', -123);
      expect(document.cookie).toBe('offset=-123');
    });

    it('a number array', () => {
      setCookie('scores', [10, 20, 30]);
      const expected = 'scores=' + encodeURIComponent('[10,20,30]');
      expect(document.cookie).toBe(expected);
    });
  });

  describe('get', () => {
    beforeEach(() => {
      clearCookieStore();
      expect(document.cookie).toBe('');
    });

    it('a number primitive', () => {
      setCookie('count', 42);
      const schema = z.number();
      const result = getCookie('count', 0, schema);
      expect(result).toBe(42);
    });

    it('a number primitive fallback', () => {
      setCookie('count', 'not-a-number');
      const schema = z.number();
      const result = getCookie('count', 0, schema);
      expect(result).toBe(0);
    });

    it('a number array', () => {
      setCookie('scores', [10, 20, 30]);
      const schema = z.array(z.number());
      const result = getCookie('scores', [0], schema);
      expect(result).toEqual([10, 20, 30]);
    });

    it('a number array fallback', () => {
      setCookie('scores', [10, 'invalid', 30]);
      const schema = z.array(z.number());
      const result = getCookie('scores', [0], schema);
      expect(result).toEqual([0]);
    });

    it('a number with constraints', () => {
      setCookie('age', 25);
      const schema = z.number().min(18).max(100);
      const result = getCookie('age', 18, schema);
      expect(result).toBe(25);
    });

    it('a number with constraints fallback', () => {
      setCookie('age', 15);
      const schema = z.number().min(18).max(100);
      const result = getCookie('age', 18, schema);
      expect(result).toBe(18);
    });
  });
});
