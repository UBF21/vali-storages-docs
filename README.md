# vali-storages

TypeScript library for browser storage management with **AES-GCM encryption**, **TTL expiration**, **namespacing**, **cross-tab sync**, and a fully typed API.

[![npm version](https://img.shields.io/npm/v/vali-storages)](https://www.npmjs.com/package/vali-storages)
[![license](https://img.shields.io/npm/l/vali-storages)](LICENSE)

---

## Installation

```bash
bun add vali-storages
# or
npm install vali-storages
```

---

## Quick Start

```typescript
import { ValiStorages, AES, TimeUnit } from 'vali-storages';

const storage = new ValiStorages({
  isEncrypt: true,
  predefinedKey: 'my-secret-key',
  keySize: AES.AES_256,
  timeExpiration: 2,
  timeUnit: TimeUnit.HOURS,
  prefix: 'myapp',
});

await storage.setItem('user', { name: 'Felipe', role: 'admin' });
const user = await storage.getItem<{ name: string; role: string }>('user');
```

---

## Features

| Feature | Description |
|---------|-------------|
| 🔐 **AES-GCM encryption** | AES-128 / 192 / 256-bit via Web Crypto API |
| ⏱ **TTL expiration** | Seconds, minutes, hours, or days |
| 🔄 **Sliding expiration** | TTL resets on every successful read |
| 🏷 **Namespacing** | Isolate keys between instances with `prefix` |
| 📡 **Cross-tab sync** | React to changes from other browser tabs |
| 🧩 **Batch operations** | `setItems` / `getItems` / `getAll` |
| 🛡 **Error handling** | `throw`, `silent`, or custom handler |
| 🔒 **Type-safe API** | `createTypedStorage<Schema>()` |
| 🖥 **SSR guard** | Safe check before instantiation |

---

## Configuration

```typescript
new ValiStorages({
  predefinedKey: string,          // passphrase for AES key derivation
  keySize: AES,                   // AES.AES_128 | AES.AES_192 | AES.AES_256
  isEncrypt: boolean,             // encrypt values before storing
  timeExpiration: number,         // item lifetime value
  timeUnit: TimeUnit,             // SECONDS | MINUTES | HOURS | DAYS
  useSessionStorage: boolean,     // use sessionStorage instead of localStorage
  prefix: string,                 // namespace prefix to isolate keys
  slidingExpiration: boolean,     // reset TTL on every successful read
  onError: ErrorHandler,          // 'throw' | 'silent' | (err, op, key) => void
  onChange: (key, value) => void, // fires when another tab modifies a key
})
```

---

## API

```typescript
// Write
await storage.setItem(key, value)
await storage.setItems({ key1: val1, key2: val2 })

// Read
await storage.getItem<T>(key)                      // T | null
await storage.getItems<T>(['key1', 'key2'])        // Record<string, T | null>
await storage.getAll<T>()                          // Record<string, T>
await storage.getOrSet(key, () => computeValue())  // T

// Check
storage.has(key)       // boolean
storage.size()         // number
storage.getAllKeys()    // string[]

// Delete
storage.removeItem(key)
storage.removeExpired()
storage.clear()

// TTL
storage.updateExpiry(key)  // boolean — reset TTL manually

// Lifecycle
storage.destroy()              // remove cross-tab listener
ValiStorages.isAvailable()    // boolean — check storage availability
```

---

## Type-Safe Storage

```typescript
import { createTypedStorage } from 'vali-storages';

interface AppSchema {
  userId: number;
  token: string;
  settings: { theme: 'dark' | 'light'; language: string };
}

const storage = createTypedStorage<AppSchema>({ prefix: 'myapp' });

await storage.setItem('userId', 42);          // ✅ OK
await storage.setItem('userId', 'wrong');     // ❌ TypeScript error
await storage.setItem('unknown', 'value');    // ❌ Key not in schema

const id = await storage.getItem('userId');   // → number | null
```

---

## Encryption

```typescript
const storage = new ValiStorages({
  isEncrypt: true,
  predefinedKey: 'my-passphrase',  // deterministic — same key always produced
  keySize: AES.AES_256,
});

await storage.setItem('token', 'secret');
const token = await storage.getItem<string>('token'); // decrypted automatically
```

> Use the same `predefinedKey` every time you instantiate. Key derivation is deterministic.

---

## TTL & Sliding Expiration

```typescript
const storage = new ValiStorages({
  timeExpiration: 30,
  timeUnit: TimeUnit.MINUTES,
  slidingExpiration: true, // TTL resets to 30min on every read
});

await storage.setItem('session', { userId: 42 });
const session = await storage.getItem('session'); // TTL reset here
```

---

## Cross-Tab Sync

```typescript
const storage = new ValiStorages({
  prefix: 'app',
  onChange: (key, newValue) => {
    if (key === 'theme') applyTheme(newValue as string);
    if (newValue === null) console.log(`${key} was removed`);
  },
});

storage.destroy(); // call on component unmount
```

---

## Namespacing

```typescript
const auth = new ValiStorages({ prefix: 'auth' });
const cart = new ValiStorages({ prefix: 'cart' });

await auth.setItem('token', 'abc');
await cart.setItem('token', 'xyz');

await auth.getItem('token'); // → 'abc'
await cart.getItem('token'); // → 'xyz'

auth.clear(); // only removes auth:* keys
```

---

## Error Handling

```typescript
// Throw (default)
const storage = new ValiStorages({ onError: 'throw' });

// Silent — returns null on read errors, ignores write errors
const storage = new ValiStorages({ onError: 'silent' });

// Custom handler
const storage = new ValiStorages({
  onError: (error, operation, key) => {
    Sentry.captureException(error, { extra: { operation, key } });
  },
});
```

---

## SSR / Next.js

```typescript
if (ValiStorages.isAvailable()) {
  const storage = new ValiStorages({ prefix: 'app' });
}

// or in React
useEffect(() => {
  const storage = new ValiStorages({ prefix: 'app' });
}, []);
```

---

## Migration from v1.x

**`setItem` is now async** — add `await` to all calls.

```typescript
// v1.x
storage.setItem('key', value);

// v2.0.0
await storage.setItem('key', value);
```

**`getItem` no longer uses a callback** — returns `Promise<T | null>`.

```typescript
// v1.x
storage.getItem('key', (item) => console.log(item));

// v2.0.0
const item = await storage.getItem('key');
```

---

## Enums

```typescript
AES.AES_128  // 16 bytes — 128-bit (default)
AES.AES_192  // 24 bytes — 192-bit
AES.AES_256  // 32 bytes — 256-bit

TimeUnit.SECONDS
TimeUnit.MINUTES
TimeUnit.HOURS
TimeUnit.DAYS
```

---

## License

MIT © [Felipe Rafael Montenegro Morriberon](https://fm-portafolio.netlify.app/)
