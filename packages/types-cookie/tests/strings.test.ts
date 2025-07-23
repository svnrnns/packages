import { describe, beforeEach, it, expect } from 'vitest';
import { get as getCookie, set as setCookie, clear as clearCookieStore } from '../lib/index';
import * as z from 'zod';

describe('String Cookies', () => {
  describe('set', () => {
    beforeEach(() => {
      clearCookieStore();
      expect(document.cookie).toBe('');
    });

    it('a literal string', () => {
      setCookie('locale', 'en');
      expect(document.cookie).toContain('locale=en');
    });

    it('a string with speical characters', () => {
      setCookie('email', 'hello@world');
      expect(document.cookie).toBe('email=' + encodeURIComponent('hello@world'));
    });

    it('a string array', () => {
      setCookie('locales', ['en', 'es', 'fr']);
      const expected = 'locales=' + encodeURIComponent('["en","es","fr"]');
      expect(document.cookie).toBe(expected);
    });
  });

  describe('get', () => {
    beforeEach(() => {
      clearCookieStore();
      expect(document.cookie).toBe('');
    });

    it('a string primitive', () => {
      setCookie('text', 'hello');
      const schema = z.string();
      const matches = getCookie('text', 'default', schema);
      expect(matches).toBe('hello');
    });

    it('a string primitive fallback', () => {
      setCookie('text', 1);
      const schema = z.string();
      const fallback = getCookie('text', 'default', schema);
      expect(fallback).toBe('default');
    });

    it('a string array', () => {
      setCookie('locales', ['en', 'es', 'fr']);
      const schema = z.array(z.string());
      const result = getCookie('locales', ['default'], schema);
      expect(result).toEqual(['en', 'es', 'fr']);
    });

    it('a string array fallback', () => {
      setCookie('locales', ['en', 23, 'fr']);
      const schema = z.array(z.string());
      const result = getCookie('locales', ['default'], schema);
      expect(result).toEqual(['default']);
    });

    it('a string enum', () => {
      setCookie('locale', 'en');
      const schema = z.enum(['en', 'es', 'fr']);
      const result = getCookie('langs', 'en', schema);
      expect(result).toEqual('en');
    });

    it('a string enum fallback', () => {
      setCookie('locale', 'this definitely isnt a locale');
      const schema = z.enum(['en', 'es', 'fr']);
      const result = getCookie('langs', 'en', schema);
      expect(result).toEqual('en');
    });
  });
});
