import { ZodSchema } from 'zod';
import { type CookieOptions } from './types';

export default class Cookie {
  private getExpirationDate(expires: CookieOptions['expires']): Date | null {
    if (expires === 'never') {
      return this.getFarFutureDate();
    }
    if (typeof expires === 'number') {
      return this.getDateFromDays(expires);
    }
    if (typeof expires === 'object' && expires !== null) {
      return this.getDateFromTimeUnits(expires);
    }
    return null;
  }

  private getFarFutureDate(): Date {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 20);
    return date;
  }

  private getDateFromDays(days: number): Date {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    return date;
  }

  private getDateFromTimeUnits({
    days = 0,
    hours = 0,
    minutes = 0,
  }: {
    days?: number;
    hours?: number;
    minutes?: number;
  }): Date {
    const date = new Date();
    const milliseconds = days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000;
    date.setTime(date.getTime() + milliseconds);
    return date;
  }

  private isValidJson(value: any): boolean {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Checks if cookies are enabled in the browser.
   * @returns True if cookies are enabled, false otherwise.
   */
  static isEnabled() {
    return navigator.cookieEnabled;
  }

  /**
   * Sets a cookie with a specified key, value, and optional configuration.
   * @param key - The key under which to store the value.
   * @param value - The value to store in the cookie.
   * @param options - Optional cookie configuration.
   */
  set<T>(key: string, value: T, options: CookieOptions = {}): void {
    const {
      expires = 7, // Defaults to 7 days
      path = '/',
      domain,
      secure,
      sameSite,
    } = options;

    const isPrimitive = typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
    const cookieValue = isPrimitive ? String(value) : JSON.stringify(value);
    let cookie = `${key}=${encodeURIComponent(cookieValue)}`;

    const expirationDate = this.getExpirationDate(expires);
    if (expirationDate) {
      cookie += `;expires=${expirationDate.toUTCString()}`;
    }

    cookie += `;path=${path}`;
    if (domain) cookie += `;domain=${domain}`;
    if (secure) cookie += ';secure';
    if (sameSite) cookie += `;SameSite=${sameSite}`;

    document.cookie = cookie;
  }

  /**
   * Retrieves a value from a cookie by key, with a fallback value and Zod schema validation.
   * @template T - The expected type of the retrieved value.
   * @param key - The key of the cookie to retrieve.
   * @param fallback - The default value to return if the cookie is not found or invalid.
   * @param schema - Zod schema to validate the parsed value.
   * @returns The retrieved value or the fallback value if retrieval fails.
   */
  get<T>(key: string, fallback: T, schema: ZodSchema<T>): T {
    const cookies = document.cookie.split(';');
    const cookie = cookies.map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(`${key}=`));

    if (!cookie) return fallback;

    const value = decodeURIComponent(cookie.split('=')[1]);
    const parsed = this.isValidJson(value) ? JSON.parse(value) : value;

    const result = schema.safeParse(parsed);
    return result.success ? result.data : fallback;
  }

  /**
   * Removes a cookie by setting its expiration to a past date.
   * @param key - The key of the cookie to remove.
   */
  remove(key: string): void {
    document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }

  /** Wipes the whole cookie store. */
  clear(): void {
    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      if (name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    });
  }
}
