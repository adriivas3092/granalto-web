# Sincronización de productos desde SAP (u otro ERP)

Endpoint que actualiza el catálogo de la tienda por **SKU** (número de artículo).

## Endpoint

```
POST https://<tu-dominio>/api/sync/products
Headers:
  Content-Type: application/json
  x-api-key: <SYNC_API_KEY>
```

## Variables de entorno (en el servidor / Vercel)

| Variable | Descripción |
|---|---|
| `SYNC_API_KEY` | Clave secreta que debe enviar SAP en el header `x-api-key`. Definila con un valor largo y aleatorio. |
| `SUPABASE_SERVICE_ROLE_KEY` | Llave `service_role` del proyecto Supabase (Settings → API). **Solo en el servidor, nunca en el navegador.** |

> Sin estas variables el endpoint responde `503` (no configurado).

## Cuerpo (JSON)

```json
{
  "items": [
    { "sku": "9642", "name": "CATALIZZATORE TUBETTO", "price": 12000, "stock": 19 },
    { "sku": "10776", "price": 45000, "stock": 26, "category": "wilsonart" },
    { "sku": "34557", "discontinued": true }
  ]
}
```

Campos por ítem:

| Campo | Obligatorio | Nota |
|---|---|---|
| `sku` | ✅ | Clave de emparejamiento. |
| `name` | — | Solo se usa al crear, o si querés actualizar el nombre. |
| `price` | — | Precio (número). |
| `stock` | — | Existencias (entero). |
| `available` | — | `true`/`false` para mostrar u ocultar. |
| `discontinued` | — | `true` oculta el producto (no lo borra). |
| `description` | — | Descripción. |
| `currency` | — | `CRC` (por defecto) o `USD`. |
| `category` | — | slug de categoría existente (`tenax`, `wilsonart`, `granalto`). |

## Comportamiento

- **SKU existente** → actualiza solo los campos enviados. **Nunca** toca la foto (`image_url`) ni la visibilidad, salvo que envíes `available` o `discontinued`.
- **SKU nuevo** → crea el producto **oculto** (`available=false`) y **sin foto**, para revisarlo en `/admin` antes de publicarlo.
- `discontinued: true` → oculta (no borra).
- Máximo 5000 ítems por llamada. Para catálogos grandes, enviar por lotes.

## Respuesta

```json
{ "success": true, "received": 3, "created": 1, "updated": 2, "hidden": 1, "skipped": 0, "errors": [] }
```

## Ejemplo (curl)

```bash
curl -X POST https://<tu-dominio>/api/sync/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: $SYNC_API_KEY" \
  -d '{"items":[{"sku":"9642","price":12000,"stock":19}]}'
```

## Recomendación de operación

- SAP es la fuente de verdad de **precio y stock**; la tienda conserva **fotos y curación**.
- Programá la sincronización (p. ej. cada hora o cada noche) desde SAP Integration Suite/CPI, un job/ETL o un export.
- Revisá periódicamente en `/admin` los productos **nuevos (ocultos)** para asignarles foto y publicarlos.
