# Notificaciones del cotizador (Dibujo y Logística)

Al enviar una solicitud desde `/cotizar`, el sistema:

1. Genera un **folio único** (`GRA-AAAAMMDD-XXXX`).
2. Arma la **ficha técnica** completa del pedido (proyecto, material, color, espesor,
   medidas por tramo, moldura, salpicadero, área, precio/plazo, entrega y cliente).
3. Envía correos:
   - **Dibujo** (siempre): valida disponibilidad de material y medidas, y lleva el control.
   - **Logística** (en copia): solo cuando la modalidad es **entrega a domicilio**.
   - **Ventas / info** (en copia): siempre.
   - **Cliente**: confirmación con la ficha como respaldo.
4. Muestra al cliente el resumen completo en pantalla (imprimible / PDF) como respaldo.

El envío es por **Resend** (HTTP, sin dependencias). Si no está configurado, cae a un
**webhook** opcional y siempre registra en el log del servidor; un fallo de correo
**no** rompe el registro del pedido.

## Variables de entorno (Vercel)

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `RESEND_API_KEY` | API key de Resend. Sin esto no se envían correos. | — |
| `CONFIGURADOR_FROM` | Remitente verificado en Resend. | `Granalto <pedidos@granalto.net>` |
| `DIBUJO_EMAIL` | Correo del equipo de Dibujo (destinatario principal). | `dibujo@granalto.net` |
| `LOGISTICA_EMAIL` | Correo de Logística (copia si hay entrega a domicilio). | `logistica@granalto.net` |
| `VENTAS_EMAIL` | Copia general de cada solicitud. | `info@granalto.net` |
| `CONFIGURADOR_WEBHOOK_URL` | Respaldo si no se usa Resend (Zapier/Make/API propia). | — |

## Pasos para activarlo

1. Crear una cuenta en Resend y **verificar el dominio** `granalto.net` (registros SPF/DKIM).
2. Crear una API key y guardarla en Vercel como `RESEND_API_KEY`.
3. Definir `CONFIGURADOR_FROM` con un remitente del dominio verificado.
4. Ajustar `DIBUJO_EMAIL`, `LOGISTICA_EMAIL` y `VENTAS_EMAIL` con los correos reales.
5. Redeploy.

> Mientras no exista `RESEND_API_KEY`, las solicitudes se registran igual (folio + respaldo
> en pantalla) pero no se envían correos. La persistencia opcional en Supabase usa la tabla
> `configuraciones` (folio, payload, notificacion, created_at) si existe y hay service role.
