# Implementación GreenPay 2.0 (Checkout v2) — Granalto

Resumen técnico de **cómo estamos llamando a la API de GreenPay**, para revisar
en sesión con el equipo de GreenPay.

- **Comercio (merchantId):** `44887f2a-92ae-4461-994d-334167fefbb6`
- **Ambiente:** sandbox
- **Stack:** Next.js (servidor) + `@greenpay_prod/3ds-react` (navegador, para 3DS)

El flujo implementado sigue la documentación: **1)** obtener token en `/auth/token`,
**2)** crear la orden en `/createOrder` con el JWT, **3)** 3D Secure en el navegador.

---

## Paso 1 — Autenticación: `POST /auth/token`  ← AQUÍ FALLA

**Request que enviamos:**
```http
POST https://auth.greenpaysbx.me/auth/token
Content-Type: application/json
Accept: application/json

{
  "api_key":   "<api_key>",
  "api_secret":"<api_secret>"
}
```

**Código (servidor, Node/Next.js):**
```ts
const res = await fetch("https://auth.greenpaysbx.me/auth/token", {
  method: "POST",
  headers: { "Content-Type": "application/json", "Accept": "application/json" },
  body: JSON.stringify({ api_key, api_secret }),
});
const json = await res.json();
if (!res.ok || !json.access_token) {
  // ← aquí se corta: res.status === 401
  throw new Error("GreenPay rechazó las credenciales de API (api_key/api_secret).");
}
```

**Respuesta que recibimos (SIEMPRE):**
```json
{ "code": "AUTH_INVALID_API_KEY",
  "message": "api_key inexistente, revocada, expirada o secret incorrecto" }
```

**Credenciales que probamos como `api_key` / `api_secret`** (todas → `401`):
1. `api_key` = `gps_k1__…`            · `api_secret` = `<secret base64>`
2. `api_key` = `<secret base64>`       · `api_secret` = `gps_k1__…`
3. `api_key` = `44887f2a-…` (merchantId) · `api_secret` = `gps_k1__…`

**Duda central:** el documento de credenciales que nos dieron contiene **un solo
`secret`** (`gps_k1__…`) + el `merchantId`. Pero `/auth/token` requiere **dos**
valores (`api_key` y `api_secret`, formato `gp_test_…` / `sk_…`).
👉 **¿Cuál es el `api_key` y cuál el `api_secret` correctos para nuestro comercio?**
¿Debemos generarlos en la consola (no encontramos la opción) o nos los pueden
proveer?

---

## Paso 2 — Crear orden: `POST /createOrder` (ya implementado, aún no alcanzado)

Una vez tengamos el JWT, llamamos así:

```http
POST https://checkoutv2.greenpaysbx.me/createOrder
Content-Type: application/json
Accept: application/json
Authorization: Bearer <access_token del paso 1>

{
  "secret": "<secret>",
  "merchantId": "44887f2a-92ae-4461-994d-334167fefbb6",
  "terminal": "064e158d-1715-4c67-8db5-b6d8dcd52155",
  "amount": 9725,
  "currency": "CRC",
  "description": "Pedido Granalto",
  "orderReference": "<uuid del pedido>",
  "additional": { "customer": { … }, "products": [ … ] }
}
```

Notas de lo ya verificado contra el esquema:
- `amount` se envía como **Number** (no string).
- `merchantId` y `terminal` son **UUID v4 válidos**.
- `currency` = `CRC` (probado también `USD` con el terminal USD).
- Longitudes dentro de rango (`description` 5–200, `orderReference` 4–100).

Antes de implementar `/auth/token`, al llamar `/createOrder` **sin** el Bearer
recibíamos `400 { "message": "Event object failed validation", gp_error:
{ name: "BadRequestError" } }` — consistente con una llamada **no autenticada**.

---

## Paso 3 — 3D Secure (navegador)

Usamos el SDK oficial `@greenpay_prod/3ds-react` (`GreenPay3DSPayment`), que recibe
`{ cardData: { ed, session }, sessionToken: token, terminalId }` con la `session` y
el `token` que devuelve `/createOrder`. La tarjeta se codifica en Base64 (`ed`) en
el navegador; **no pasa por nuestro servidor**.

---

## Lo único que bloquea todo
Obtener el **`api_key` + `api_secret`** válidos para el comercio
`44887f2a-92ae-4461-994d-334167fefbb6` en sandbox. Con eso, el flujo completo
(auth → createOrder → 3DS) queda operativo sin más cambios.
