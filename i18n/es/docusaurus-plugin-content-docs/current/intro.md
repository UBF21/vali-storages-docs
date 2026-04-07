---
id: intro
title: Introducción
sidebar_label: Introducción
slug: /intro
---

# Vali-Storages

**Librería TypeScript para manejo de almacenamiento del navegador con encriptación AES-GCM, expiración TTL, namespacing, sincronización cross-tab y una API completamente tipada.**

[![npm version](https://img.shields.io/npm/v/vali-storages)](https://www.npmjs.com/package/vali-storages)
[![license](https://img.shields.io/npm/l/vali-storages)](https://github.com/UBF21/vali-storages/blob/main/LICENSE)

---

## ¿Por qué Vali-Storages?

El `localStorage` y `sessionStorage` nativos no tienen tipos, no están encriptados y no tienen expiración integrada. `Vali-Storages` los envuelve con una API async limpia que agrega:

- **Seguridad** — encriptación AES-GCM 128/192/256 bits via Web Crypto API
- **Confiabilidad** — expiración TTL automática con soporte de ventana deslizante
- **Aislamiento** — namespacing basado en prefijos para prevenir colisiones de claves
- **Reactividad** — sincronización cross-tab con una API de callbacks
- **Seguridad de tipos** — factory `createTypedStorage<Schema>()` completamente tipada

---

## Características clave

| Característica | Descripción |
|----------------|-------------|
| 🔐 **Encriptación AES-GCM** | AES-128 / 192 / 256 via Web Crypto API |
| ⏱ **Expiración TTL** | Segundos, minutos, horas o días |
| 🔄 **Sliding expiration** | El TTL se reinicia en cada lectura exitosa |
| 🏷 **Namespacing** | Aísla claves entre instancias con `prefix` |
| 📡 **Sync cross-tab** | Reacciona a cambios desde otras pestañas |
| 🧩 **Operaciones batch** | `setItems` / `getItems` / `getAll` |
| 🛡 **Manejo de errores** | `throw`, `silent` o manejador personalizado |
| 🔒 **API tipada** | `createTypedStorage<Schema>()` |
| 🖥 **Guard SSR** | Error claro cuando se usa fuera del navegador |

---

## Ejemplo rápido

```typescript
import { ValiStorages, AES, TimeUnit } from 'vali-storages';

const storage = new ValiStorages({
    isEncrypt: true,
    predefinedKey: 'mi-clave-secreta',
    keySize: AES.AES_256,
    timeExpiration: 2,
    timeUnit: TimeUnit.HOURS,
    prefix: 'miapp',
});

await storage.setItem('usuario', { nombre: 'Felipe', rol: 'admin' });
const usuario = await storage.getItem<{ nombre: string; rol: string }>('usuario');
```

---

## Próximos pasos

- [Primeros pasos](./getting-started) — instalación y patrones de uso
- [Referencia de API](./api-reference) — documentación completa de métodos
- [Migración desde v1.x](./migration) — guía de actualización
