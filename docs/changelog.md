---
id: changelog
title: Changelog
sidebar_label: Changelog
---

# Changelog

All notable changes to **vali-storages** are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) — versioning follows [Semantic Versioning](https://semver.org/).

---

## [2.0.0] — 2024-12-01

### Breaking Changes

- **`setItem` is now async** — returns `Promise<void>` instead of `void`. Add `await` to all calls.
- **`getItem` no longer uses a callback** — returns `Promise<T | null>` directly.

```typescript
// v1.x
storage.setItem('key', value);
storage.getItem('key', (item) => console.log(item));

// v2.0.0
await storage.setItem('key', value);
const item = await storage.getItem('key');
```

### Added

- `setItems(items)` — batch write multiple keys in parallel
- `getItems(keys)` — batch read multiple keys in parallel
- `getAll()` — return all non-expired items in the namespace
- `getOrSet(key, factory)` — cache pattern: return existing or compute and store
- `has(key)` — check key existence without decrypting
- `removeExpired()` — purge all expired keys in the namespace
- `updateExpiry(key)` — manually reset TTL of an existing key
- `size()` — count of items in the namespace
- `prefix` option — namespace isolation between instances
- `slidingExpiration` option — reset TTL on every successful read
- `onError` option — `'throw'` | `'silent'` | custom handler
- `onChange` option — cross-tab synchronization callback
- `createTypedStorage<Schema>()` — compile-time type-safe factory
- `ValiStorages.isAvailable()` — static SSR guard
- `destroy()` — removes the cross-tab event listener

### Fixed

- Errors in `setItem` were silently swallowed in v1.x — now they propagate to the caller

---

## [1.1.0] — 2024-09-15

### Added

- `useSessionStorage` option — use `sessionStorage` instead of `localStorage`
- `AES.AES_192` key size option

### Fixed

- Key collision when two instances shared the same `prefix` with different `keySize`

---

## [1.0.0] — 2024-07-01

### Added

- `ValiStorages` class with AES-GCM encryption via Web Crypto API
- `AES.AES_128` and `AES.AES_256` key sizes
- TTL expiration with `timeExpiration` + `TimeUnit` (`SECONDS`, `MINUTES`, `HOURS`, `DAYS`)
- `setItem` / `getItem` / `removeItem` / `clear` / `getAllKeys`
- `predefinedKey` for deterministic key derivation
