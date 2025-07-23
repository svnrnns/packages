import { describe, beforeEach, it, expect } from 'vitest';
import { get as getCookie, set as setCookie, clear as clearCookieStore } from '../lib/index';
import * as z from 'zod';

describe('Boolean Cookies', () => {
  describe('set', () => {
    beforeEach(() => {
      clearCookieStore();
      expect(document.cookie).toBe('');
    });

    it('a true boolean', () => {
      setCookie('enabled', true);
      expect(document.cookie).toBe('enabled=true');
    });

    it('a false boolean', () => {
      setCookie('disabled', false);
      expect(document.cookie).toBe('disabled=false');
    });

    it('a boolean array', () => {
      setCookie('flags', [true, false, true]);
      const expected = 'flags=' + encodeURIComponent('[true,false,true]');
      expect(document.cookie).toBe(expected);
    });
  });

  describe('get', () => {
    beforeEach(() => {
      clearCookieStore();
      expect(document.cookie).toBe('');
    });

    it('a boolean primitive', () => {
      setCookie('enabled', true);
      const schema = z.boolean();
      const result = getCookie('enabled', false, schema);
      expect(result).toBe(true);
    });

    it('a boolean primitive fallback', () => {
      setCookie('enabled', 'not-a-boolean');
      const schema = z.boolean();
      const result = getCookie('enabled', false, schema);
      expect(result).toBe(false);
    });

    it('a boolean array', () => {
      setCookie('flags', [true, false, true]);
      const schema = z.array(z.boolean());
      const result = getCookie('flags', [false], schema);
      expect(result).toEqual([true, false, true]);
    });

    it('a boolean array fallback', () => {
      setCookie('flags', [true, 'invalid', false]);
      const schema = z.array(z.boolean());
      const result = getCookie('flags', [false], schema);
      expect(result).toEqual([false]);
    });
  });
});
