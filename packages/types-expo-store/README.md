# types-expo-store

A lightweight. type-safe, Zod-powered wrapper for [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/) for React Native and Expo apps. Ensures you always get the type you expect from secure storage, with runtime validation, namespaces, and optional expiration.

## Features

- **Type Safety**: Validates values with [Zod](https://github.com/colinhacks/zod) schemas.
- **Async & Sync API**: Use async methods for all real-world usage; sync methods are for compatibility.
- **Namespaces**: Avoid key collisions by scoping your keys.
- **Expiration**: Store values with a TTL (time-to-live).
- **Biometric Support**: Check if biometric authentication is available.
- **Fallbacks**: Always get a value of the expected type, or your fallback.

## Installation

```bash
npm install types-expo-store zod
```

## Important

While you dont need to install the base `expo-secure-store` for this package to work. It's still needed for your project if you want to enable custom plugins like the Android Shared Preferences backup.

e.g

```bash
npm install expo-secure-store
```

```json
// app.json (expo)
"plugins": [
  "expo-router",
  ["expo-secure-store", { "configureAndroidBackup": true }]
]
```

## Usage

### 1. Create a TypeSafeStore instance

```ts
import { TypeSafeStore } from 'types-expo-store';
import * as z from 'zod';

const store = new TypeSafeStore();
```

Use a namespace to prefix keys and avoid conflicts:

```ts
const store = new TypeSafeStore('my-app');
```

### 2 Store data

Store data to the SecureStore using the `set` method:

```ts
await storage.setAsync('theme', 'dark');

// Or direct method import.
import { setAsync } from 'types-expo-store';
await setAsync('theme', 'dark');
```

### 3. Retrieve values with type safety

```ts
const themeSchema = z.enum(['light', 'dark']);
const theme = await store.getAsync('theme', 'light', themeSchema); // 'dark' or fallback 'light' if invalid or not found
```

### 4. Use expiration (TTL)

```ts
await store.setAsyncWithExpiration('token', 'xxxx', 3600000); // Expires in 1 hour
const tokenSchema = z.string();
const token = await store.getAsync('token', '', tokenSchema); // '' if expired or invalid
```

### 5. Check existence, remove, and biometric support

```ts
// Check if a key exists
const exists = await store.existsAsync('theme');
// Remove a key and its content
await store.removeAsync('theme');
// Check if biometric support is available
const canBiometric = store.canUseBiometricAuthentication();
```

### Extra. Direct default store usage

You can also use the default store via named imports:

```ts
import { setAsync, getAsync } from 'types-expo-store';
import * as z from 'zod';

await setAsync('user', { id: 1 }, 3600000);
const userSchema = z.object({ id: z.number() });
const user = await getAsync('user', { id: 0 }, userSchema);
```

## API Reference

### Class: `TypeSafeStore`

- `constructor(namespace?: string)` — Optionally provide a namespace for all keys.
- `set<T>(key, value)` — Store a value.
- `setAsync<T>(key, value)` — Store a value (async).
- `get<T>(key, fallback, schema)` — Retrieve and validate a value.
- `getAsync<T>(key, fallback, schema)` — Retrieve and validate a value (async).
- `setWithAsyncExpiration<T>(key, value, ttl)` — Store a value with expiration (async).
- `removeAsync(key)` — Remove a key (async).
- `exists(key)` — Check if a key exists.
- `existsAsync(key)` — Check if a key exists (async).
- `canUseBiometricAuthentication()` — Returns whether biometric auth is available.
- `getNamespace()` / `setNamespace(ns)` — Get/set the current namespace.
- `static isAvailableAsync()` — Returns whether SecureStore is available on device.

> **Note:** `clear` and `length` are not supported by expo-secure-store and will only log a warning.

## License

MIT License © 2025
