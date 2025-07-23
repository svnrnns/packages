# Type Safe Cookie

`types-cookie` is a lightweight TypeScript library for managing browser cookies with type safety and a flexible, modern API. <br/>
It uses **Zod** for type validation.

## Features

- **Type Safety**: Built for TypeScript with generic types and Zod schemas.
- **Fallback values**: To make sure a value of the same type is always retrieved.
- **Safe Cookie Access**: Handles JSON parsing errors gracefully.
- **Flexible Expiration:** Set expiration in days, hours, minutes, or "never".
- **Cookie Options**: Full support for path, domain, secure, and SameSite attributes.
- **Simple API**: Friendly user experience. Dealing with Cookies has never been this easy.

## Installation

Install `types-cookie` via npm:

```bash
npm install types-cookie zod
```

## Ready to use

Easily store and retrieve user settings that persist across sessions. Use direct methods or create a `Cookie` object:

```ts
import { Cookie, set as setCookie } from 'types-cookie';

const cookie = new Cookie();

/** Use an object or access the method directly */
cookie.set('theme', 'dark', { expires: { days: 30 } });
setCookie('theme', 'dark', { expires: { days: 30 } });
```

Retrieve data with a fallback value and a Zod schema to ensure type safety:

```ts
import { get as getCookie } from 'types-cookie';

const themeSchema = z.enum(['light', 'dark']);
const theme = getCookie('theme', 'light', themeSchema);
// Returns 'light' if key 'theme' is not found or invalid
```

Store arrays or complex objects with Zod validation:

```ts
setCookie('filters', ['desc', 'price'], { expires: { hours: 2 } });

const stringArraySchema = z.array(z.string());
const filters = getCookie('filters', [], stringArraySchema);
// Returns ['desc', 'price'] or [] if invalid
```

Cookies can be set to never expire:

```ts
setCookie('token', 'xxxx', { expires: 'never' });
```

Configure cookie options for advanced use cases:

```ts
setCookie(
  'cookieConsent',
  { analytics: true, marketing: false },
  {
    path: '/',
    domain: '.example.com',
    secure: true,
    sameSite: 'Lax',
  }
);
```

## API Reference

### Static Methods

- `isEnabled(): boolean`: Checks if cookies are enabled in the browser.

### Instance methods (also available as exports)

- `set<T>(key: string, value: T, options?: CookieOptions): void` : Stores a value in a cookie with optional configuration.
- `get<T>(key: string, fallback: T, schema: ZodSchema<T>): T`: Retrieves a value with type safety using a Zod schema.
- `remove(key: string): void`: Deletes cookie by key.
- `clear(): void`: Clears all cookies.

### Types:

- `CookieOptions`:
  - `expires`: Number of days as a number, `'never'`, or `{ days?: number, hours?: number, minutes?: number }`. Defaults to `7`.
  - `path`: Cookie path (default: `'/'`).
  - `domain`: Cookie domain.
  - `secure`: HTTPS-only flag.
  - `sameSite`: `'Strict'`, `'Lax'`, or `'None'`.

MIT License © 2025
