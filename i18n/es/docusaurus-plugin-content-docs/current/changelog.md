---
id: changelog
title: Changelog
sidebar_label: Changelog
---

# Changelog

Todos los cambios notables de **vali-storages** están documentados aquí.

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) — versionado con [Semantic Versioning](https://semver.org/).

---

## [2.0.0] — 2024-12-01

### Cambios que rompen compatibilidad

- **`setItem` ahora es async** — devuelve `Promise<void>` en lugar de `void`. Agrega `await` a todas las llamadas.
- **`getItem` ya no usa callback** — devuelve `Promise<T | null>` directamente.

```typescript
// v1.x
storage.setItem('clave', valor);
storage.getItem('clave', (item) => console.log(item));

// v2.0.0
await storage.setItem('clave', valor);
const item = await storage.getItem('clave');
```

### Agregado

- `setItems(items)` — escritura batch de múltiples claves en paralelo
- `getItems(keys)` — lectura batch de múltiples claves en paralelo
- `getAll()` — retorna todos los items no expirados del namespace
- `getOrSet(key, factory)` — patrón cache: retorna existente o calcula y guarda
- `has(key)` — verifica existencia de clave sin desencriptar
- `removeExpired()` — elimina todas las claves expiradas del namespace
- `updateExpiry(key)` — reinicia el TTL de una clave existente manualmente
- `size()` — cantidad de items en el namespace
- Opción `prefix` — aislamiento de namespace entre instancias
- Opción `slidingExpiration` — reinicia el TTL en cada lectura exitosa
- Opción `onError` — `'throw'` | `'silent'` | manejador personalizado
- Opción `onChange` — callback de sincronización cross-tab
- `createTypedStorage<Schema>()` — factory con tipos estrictos en compilación
- `ValiStorages.isAvailable()` — método estático de guardia para SSR
- `destroy()` — elimina el listener de eventos cross-tab

### Corregido

- Los errores en `setItem` se perdían silenciosamente en v1.x — ahora se propagan al caller

---

## [1.1.0] — 2024-09-15

### Agregado

- Opción `useSessionStorage` — usar `sessionStorage` en lugar de `localStorage`
- Tamaño de clave `AES.AES_192`

### Corregido

- Colisión de claves cuando dos instancias compartían el mismo `prefix` con diferente `keySize`

---

## [1.0.0] — 2024-07-01

### Agregado

- Clase `ValiStorages` con encriptación AES-GCM via Web Crypto API
- Tamaños de clave `AES.AES_128` y `AES.AES_256`
- Expiración TTL con `timeExpiration` + `TimeUnit` (`SECONDS`, `MINUTES`, `HOURS`, `DAYS`)
- `setItem` / `getItem` / `removeItem` / `clear` / `getAllKeys`
- `predefinedKey` para derivación de clave determinista
