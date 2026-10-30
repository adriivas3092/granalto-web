# Migración de granaltocr.net a la web nueva (Vercel)

Guía para apuntar el dominio **granaltocr.net** a la web nueva **sin perder el
correo** de Google Workspace y sin depender de la agencia.

> Vos sos dueño del dominio en el registrador. El DNS hoy lo administra
> **SiteGround** (nameservers `ns1.siteground.net` / `ns2.siteground.net`) y el
> correo está en **Google Workspace**.

---

## Estado actual (verificado en Vercel)

- `granaltocr.net` y `www.granaltocr.net` **ya están agregados y verificados** en
  el proyecto de Vercel (`granalto-web`). El apex redirige a `www` (308).
- Pero el DNS **todavía apunta al servidor viejo** (`A → 35.212.77.162`), por eso
  Vercel marca el dominio como `misconfigured`. Falta **solo un paso**: cambiar
  los registros A/CNAME en SiteGround.

## Estrategia recomendada (riesgo mínimo)

**Dejamos el DNS en SiteGround y el correo intacto.** Solo cambiamos 2 registros
(el A del dominio y el CNAME de www). **NO** tocamos los nameservers ni los
registros de correo (MX/TXT). Así el email de Google Workspace sigue funcionando
sin interrupción y la web nueva queda en línea.

> No hace falta migrar a Cloudflare para lanzar. Esa migración es opcional y se
> puede hacer después con calma.

---

## Pasos (en el panel DNS de SiteGround)

Entrá a **SiteGround → Site Tools → Domain → DNS Zone Editor** del dominio
`granaltocr.net`.

### 1. Registro A del dominio raíz (@)
Editá el registro **A** del host `@` (o `granaltocr.net`):

| Campo | Valor nuevo |
|-------|-------------|
| Tipo  | `A` |
| Host  | `@` |
| Apunta a | `216.198.79.1` |
| TTL   | el más bajo que permita (p. ej. 300 / 1 hora) |

- Valor anterior a reemplazar: `35.212.77.162`.
- Si SiteGround deja agregar un segundo A para `@`, añadí también `64.29.17.1`
  (mejora la tolerancia a fallos). Si solo permite uno, con `216.198.79.1` basta.
- Alternativa válida si esas IP dieran problema: `76.76.21.21`.

### 2. Registro CNAME de www
Editá (o creá) el registro **CNAME** del host `www`:

| Campo | Valor nuevo |
|-------|-------------|
| Tipo  | `CNAME` |
| Host  | `www` |
| Apunta a | `35e029bbc4e998c5.vercel-dns-017.com.` |
| TTL   | el más bajo que permita |

- Alternativa válida: `cname.vercel-dns.com.`
- Si existe un registro **A** viejo en `www` (apuntando a `35.212.77.162`),
  borralo: `www` debe ser CNAME, no A.

### 3. Correo: NO TOCAR
Dejá **sin cambios** todos los registros de correo de Google Workspace:
- Los **MX** (apuntan a Google: `smtp.google.com` o los `aspmx…`).
- Los **TXT** de SPF (`v=spf1 include:_spf.google.com …`), DKIM (`google._domainkey`)
  y DMARC (`_dmarc`).

Como no cambiamos nameservers ni estos registros, el correo sigue igual.

---

## Verificación (después de guardar)

La propagación tarda desde unos minutos hasta unas horas (según el TTL anterior).

1. Comprobá el DNS en https://dnschecker.org:
   - `granaltocr.net` tipo **A** → debe mostrar `216.198.79.1` en la mayoría de
     ubicaciones.
   - `www.granaltocr.net` tipo **CNAME** → debe mostrar el valor `vercel-dns`.
2. En **Vercel → proyecto granalto-web → Settings → Domains**, el dominio debe
   pasar de `Invalid Configuration` a **válido** (check verde). Vercel emite el
   certificado SSL automáticamente.
3. Abrí `https://granaltocr.net` → debe redirigir a `https://www.granaltocr.net`
   y mostrar la web nueva, con candado (HTTPS).
4. Mandá/recibí un correo de prueba para confirmar que el email sigue bien.

---

## Si algo sale mal (rollback)

Volvé a poner el registro A de `@` en `35.212.77.162` (y el `www` como estaba).
En minutos regresa al estado anterior. El correo nunca se ve afectado porque no
se toca.

---

## Opcional — más adelante: mover el DNS a Cloudflare

Solo si se quiere administrar el DNS fuera de SiteGround:
1. Crear cuenta en Cloudflare y agregar el dominio → Cloudflare **copia** los
   registros actuales (revisar que estén TODOS: A, CNAME, MX y TXT de Google).
2. Cambiar los **nameservers** en el registrador a los que indique Cloudflare.
3. Verificar que los MX/TXT de Google quedaron idénticos **antes** de confirmar.

Esta ruta cambia los nameservers (más delicado por el correo), por eso no es
necesaria para lanzar: la estrategia de arriba ya deja la web nueva en línea.
