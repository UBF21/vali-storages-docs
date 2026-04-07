---
id: intro
title: Introduction
sidebar_label: Introduction
slug: /intro
---

# Vali-Storages

**TypeScript library for browser storage management with AES-GCM encryption, TTL expiration, namespacing, cross-tab sync, and a fully typed API.**

[![npm version](https://img.shields.io/npm/v/vali-storages)](https://www.npmjs.com/package/vali-storages)
[![license](https://img.shields.io/npm/l/vali-storages)](https://github.com/UBF21/vali-storages/blob/main/LICENSE)

---

## Why Vali-Storages?

Native `localStorage` and `sessionStorage` are untyped, unencrypted, and have no built-in expiration. `Vali-Storages` wraps them with a clean, async API that adds:

- **Security** — AES-GCM 128/192/256-bit encryption via Web Crypto API
- **Reliability** — automatic TTL expiration with sliding window support
- **Isolation** — prefix-based namespacing to prevent key collisions
- **Reactivity** — cross-tab synchronization with a callback API
- **Type safety** — fully typed `createTypedStorage<Schema>()` factory

---

## Key Features

| Feature | Description |
|---------|-------------|
| 🔐 **AES-GCM encryption** | AES-128 / 192 / 256 via Web Crypto API |
| ⏱ **TTL expiration** | Seconds, minutes, hours, or days |
| 🔄 **Sliding expiration** | TTL resets on every successful read |
| 🏷 **Namespacing** | Isolate keys between instances with `prefix` |
| 📡 **Cross-tab sync** | React to changes from other browser tabs |
| 🧩 **Batch operations** | `setItems` / `getItems` / `getAll` |
| 🛡 **Error handling** | `throw`, `silent`, or custom handler |
| 🔒 **Type-safe API** | `createTypedStorage<Schema>()` |
| 🖥 **SSR guard** | Clear error when used outside browser |

---

## Quick example

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

## Next steps

- [Getting Started](./getting-started) — installation and all usage patterns
- [API Reference](./api-reference) — complete method documentation
- [Migration from v1.x](./migration) — upgrade guide
