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

## Integración con SAP Business One 10 (HANA)

La empresa usa **SAP Business One 10.0 for SAP HANA**. Recomendaciones concretas:

### Origen de los datos en B1
- **SKU** → `ItemCode` (tabla `OITM` / entidad `Items`).
- **name** → `ItemName`.
- **stock** → `QuantityOnStock` del ítem (o la suma por bodega en `ItemWarehouseInfoCollection`).
- **price** → precio de una **lista de precios** concreta (`ItemPrices` / `Item_Prices`); definir cuál lista de precios se publica en la web.
- **category** → mapear el **grupo de artículos** (`ItemsGroupCode` / `OITB.ItmsGrpNam`) a un slug (`tenax`, `wilsonart`, `granalto`).
- **discontinued** → usar el campo `Frozen`/`Valid` del artículo (artículo inactivo → `discontinued: true`).

### Cómo enviarlo (2 caminos, ambos nativos de B1)
1. **B1if — Integration Framework** (viene incluido con B1): crear un escenario **programado** (cada hora/noche) que consulte los artículos y haga un **POST** por lotes a `/api/sync/products` con el header `x-api-key`. No requiere software adicional.
2. **Service Layer** (API OData v4 de B1 sobre HANA): un conector/middleware consulta `GET /b1s/v2/Items` (con los campos necesarios y paginación con `$top`/`$skip`), arma el JSON y lo envía al endpoint.

### Consejo
- Elegir **una lista de precios** oficial para la web y publicar solo esa.
- Enviar por **lotes** (p. ej. 500–1000 ítems por llamada).
- Filtrar en B1 los artículos que sí van a la web (por grupo o por un campo de usuario `U_Web = Y`), para no subir todo el maestro.

## Recomendación de operación

- SAP es la fuente de verdad de **precio y stock**; la tienda conserva **fotos y curación**.
- Programá la sincronización (p. ej. cada hora o cada noche) desde SAP Integration Suite/CPI, un job/ETL o un export.
- Revisá periódicamente en `/admin` los productos **nuevos (ocultos)** para asignarles foto y publicarlos.
