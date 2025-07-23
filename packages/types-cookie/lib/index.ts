import Cookie from './Cookie';
import { type ZodSchema } from 'zod';
import { type CookieOptions } from './types';

const defaultCookie = new Cookie();

/**
 * Retrieves a value from a cookie by key, with a fallback value and Zod schema validation.
 * @template T - The expected type of the retrieved value.
 * @param key - The key of the cookie to retrieve.
 * @param fallback - The default value to return if the cookie is not found or invalid.
 * @param schema - Zod schema to validate the parsed value.
 * @returns The retrieved value or the fallback value if retrieval fails.
 */
const get = <T>(key: string, fallback: T, schema: ZodSchema<T>): T => defaultCookie.get(key, fallback, schema);

/**
 * Sets a value in a cookie with optional configuration.
 * @param key - The key for the cookie.
 * @param value - The value to store.
 * @param options - Cookie configuration options.
 */
const set = <T>(key: string, value: T, options?: CookieOptions): void => defaultCookie.set(key, value, options);

/**
 * Removes a cookie by its key.
 * @param key - The key of the cookie to remove.
 */
const remove = (key: string): void => defaultCookie.remove(key);

/** Wipes the whole Cookie store */
const clear = (): void => defaultCookie.clear();

/**
 * Checks if cookies are enabled in the browser.
 * @returns {boolean} True if cookies are enabled, false otherwise.
 */
const isEnabled = (): boolean => Cookie.isEnabled();

export { Cookie, get, set, remove, clear, isEnabled };
export { type CookieOptions };
