import { describe, beforeEach, it, expect } from 'vitest';
import { get as getCookie, set as setCookie, clear as clearCookieStore } from '../lib/index';
import * as z from 'zod';

describe('Object Cookies', () => {
  describe('set', () => {
    beforeEach(() => {
      clearCookieStore();
      expect(document.cookie).toBe('');
    });

    it('a simple object', () => {
      setCookie('user', { id: '123', name: 'Alice' });
      const expected = 'user=' + encodeURIComponent('{"id":"123","name":"Alice"}');
      expect(document.cookie).toBe(expected);
    });

    it('a nested object', () => {
      setCookie('profile', { id: '123', details: { age: 30, city: 'Paris' } });
      const expected = 'profile=' + encodeURIComponent('{"id":"123","details":{"age":30,"city":"Paris"}}');
      expect(document.cookie).toBe(expected);
    });

    it('an object array', () => {
      setCookie('users', [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ]);
      const expected = 'users=' + encodeURIComponent('[{"id":"1","name":"Alice"},{"id":"2","name":"Bob"}]');
      expect(document.cookie).toBe(expected);
    });
  });

  describe('get', () => {
    beforeEach(() => {
      clearCookieStore();
      expect(document.cookie).toBe('');
    });

    it('a simple object', () => {
      setCookie('user', { id: '123', name: 'Alice' });
      const schema = z.object({ id: z.string(), name: z.string() });
      const result = getCookie('user', { id: 'default', name: 'Unknown' }, schema);
      expect(result).toEqual({ id: '123', name: 'Alice' });
    });

    it('a simple object fallback', () => {
      setCookie('user', { id: '123' }); // Missing name
      const schema = z.object({ id: z.string(), name: z.string() });
      const result = getCookie('user', { id: 'default', name: 'Unknown' }, schema);
      expect(result).toEqual({ id: 'default', name: 'Unknown' });
    });

    it('a nested object', () => {
      setCookie('profile', { id: '123', details: { age: 30, city: 'Paris' } });
      const schema = z.object({
        id: z.string(),
        details: z.object({ age: z.number(), city: z.string() }),
      });
      const result = getCookie('profile', { id: 'default', details: { age: 0, city: 'Unknown' } }, schema);
      expect(result).toEqual({ id: '123', details: { age: 30, city: 'Paris' } });
    });

    it('a nested object fallback', () => {
      setCookie('profile', { id: '123', details: { age: 'invalid' } });
      const schema = z.object({
        id: z.string(),
        details: z.object({ age: z.number(), city: z.string() }),
      });
      const result = getCookie('profile', { id: 'default', details: { age: 0, city: 'Unknown' } }, schema);
      expect(result).toEqual({ id: 'default', details: { age: 0, city: 'Unknown' } });
    });

    it('an object array', () => {
      setCookie('users', [
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ]);
      const schema = z.array(z.object({ id: z.string(), name: z.string() }));
      const result = getCookie('users', [{ id: 'default', name: 'Unknown' }], schema);
      expect(result).toEqual([
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ]);
    });

    it('an object array fallback', () => {
      setCookie('users', [{ id: '1', name: 'Alice' }, { id: '2' }]); // Missing name
      const schema = z.array(z.object({ id: z.string(), name: z.string() }));
      const result = getCookie('users', [{ id: 'default', name: 'Unknown' }], schema);
      expect(result).toEqual([{ id: 'default', name: 'Unknown' }]);
    });
  });
});
