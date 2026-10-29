# Diagnóstico técnico — GreenPay Checkout v2 (`/createOrder`)

**Comercio:** GRANALTO · **merchantId:** `44887f2a-92ae-4461-994d-334167fefbb6`
**Ambiente:** sandbox (`https://checkoutv2.greenpaysbx.me`)

## Resumen
La integración sigue el repositorio oficial `checkout-v2-nodejs` y la referencia
del endpoint **Crear Orden**. El request cumple **exactamente** el esquema
documentado, pero `POST /createOrder` responde **siempre**:

```json
{ "message": "Event object failed validation", "status": 400,
  "gp_error": { "name": "BadRequestError", "statusCode": 400, "expose": true } }
```

## Evidencia

### 1. El merchant y el terminal SÍ están activos en sandbox
`GET https://checkoutv2.greenpaysbx.me/merchant/44887f2a-92ae-4461-994d-334167fefbb6/plans/terminal/064e158d-1715-4c67-8db5-b6d8dcd52155`
responde `200` con JSON válido: `{"plans":[],"mergedPlans":[],"mergedBins":[]}`.

### 2. El cuerpo cumple el esquema documentado de `/createOrder`
```json
{
  "secret": "<secret provisto por GreenPay>",
  "merchantId": "44887f2a-92ae-4461-994d-334167fefbb6",
  "terminal": "064e158d-1715-4c67-8db5-b6d8dcd52155",
  "amount": 9725,
  "currency": "CRC",
  "description": "Pedido Granalto 06714DC0",
  "orderReference": "06714dc0-f506-4ed4-b121-369a0936cb52"
}
```
- `amount` enviado como **Number** (no string), ≥ 1
- `merchantId` y `terminal`: **UUID v4 válidos**
- `currency`: `CRC` (3 chars) — también probado `USD` con el terminal USD
- `description`: 24 chars (rango 5–200)
- `orderReference`: 36 chars (rango 4–100)
- Headers: `Content-Type: application/json`, `Accept: application/json`

### 3. El error NO trae el arreglo `cause`
La documentación indica que un error de validación de esquema incluye un arreglo
`cause` con `instancePath` del campo que falla. **La respuesta que recibimos no
trae `cause`**, sino un `gp_error` con `name: "BadRequestError"`. Esto sugiere que
el fallo **no es de un campo del cuerpo**, sino de una capa anterior
(procesamiento del `secret` / credencial).

### 4. Probado exhaustivamente — mismo resultado en todos los casos
- Hosts: `checkoutv2.greenpaysbx.me` y `checkoutv2.greenpayqa.me`
- **Ambos secrets** entregados (uno base64 de 344 chars y uno `gps_k1__…` de 50 chars), pegados limpios
- **Ambos terminales**: CRC `064e158d-…` y USD `a95b67f3-…`, con su moneda correspondiente
- `amount` como string y como número
- Cuerpo mínimo (7 campos) y cuerpo completo (con `additional.customer` + `products`)

## Consultas a GreenPay
1. ¿Cuál es el **secret correcto** para `/createOrder` de este comercio?
2. ¿Está la cuenta **habilitada para crear órdenes** en sandbox, o solo para
   consultar planes?
3. ¿Pueden enviar un **ejemplo de request `/createOrder` real y válido** para
   el merchant `44887f2a-92ae-4461-994d-334167fefbb6`?

La integración del lado del comercio está completa y lista; en cuanto se aclare
el punto anterior, el flujo continúa al 3D Secure sin cambios adicionales.
