import { describe, beforeEach, it, expect } from 'vitest';
import { get as getCookie, set as setCookie, clear as clearCookieStore } from '../lib/index';
import * as z from 'zod';

describe('Cookie Utilities', () => {
  beforeEach(() => {
    clearCookieStore();
    expect(document.cookie).toBe('');
  });

  it('returns fallback if cookie does not exist', () => {
    const schema = z.string();
    const result = getCookie('nonexistent', 'default', schema);
    expect(result).toBe('default');
  });

  it('returns fallback for malformed JSON', () => {
    document.cookie = 'data=' + encodeURIComponent('{invalid}');
    const schema = z.object({});
    const result = getCookie('data', {}, schema);
    expect(result).toEqual({});
  });
});
