# Migración de granaltocr.net a la web nueva (Vercel) — SIN la agencia

Objetivo: que **granaltocr.net** muestre la web nueva (Vercel) y que el **correo
de Google Workspace siga funcionando**, tomando el control del DNS desde tu
registrador para **no depender de la agencia**.

---

## Diagnóstico real (leído del DNS en vivo)

- **Registrador:** Squarespace Domains (ex–Google Domains). Vos tenés acceso.
- **DNS actual:** nameservers `ns1/ns2.siteground.net` → **lo maneja la agencia**
  (no tenés acceso a editar registros ahí).
- **Web vieja:** `A → 35.212.77.162` (SiteGround).
- **Correo:** los `MX` apuntan a `mx10/20/30.mailspamprotection.com` (filtro
  antispam de SiteGround) que **reenvía a tu Google Workspace**. El buzón real
  es Google. ✅
- **Vercel:** `granaltocr.net` y `www` ya están **agregados y verificados**; solo
  falta que el DNS apunte a Vercel.

## Estrategia

Como la agencia controla el DNS en SiteGround, **movemos el DNS a un proveedor
tuyo** cambiando los *nameservers* en el registrador (Squarespace). Ahí recreamos
TODOS los registros: web → Vercel y correo → **Google directo** (ya no por el
filtro de SiteGround).

> Recomendado: **Cloudflare** (gratis) como nuevo DNS, porque al agregar el
> dominio **importa automáticamente** los registros actuales (red de seguridad
> por si hubiera algo que no listamos). Alternativa sin crear otra cuenta: usar
> el **DNS propio de Squarespace**. Los registros a poner son los mismos.

---

## Registros a crear en el DNS nuevo

### 🌐 Web (Vercel)
| Tipo | Host | Valor | Notas |
|------|------|-------|-------|
| A | `@` | `216.198.79.1` | IP de Vercel (rank 1). Podés añadir también `64.29.17.1`. |
| CNAME | `www` | `35e029bbc4e998c5.vercel-dns-017.com` | Alternativa válida: `cname.vercel-dns.com` |

- Borrá el A viejo de `@` y de `www` que apuntan a `35.212.77.162`.
- Alternativa de IP si esas dieran problema: `76.76.21.21`.

### ✉️ Correo (Google Workspace) — ¡no omitir!
| Tipo | Host | Prioridad | Valor |
|------|------|-----------|-------|
| MX | `@` | 1 | `smtp.google.com` |

> Opción clásica (si tu panel no acepta el registro único, poné estos 5):
> `1 ASPMX.L.GOOGLE.COM` · `5 ALT1.ASPMX.L.GOOGLE.COM` · `5 ALT2.ASPMX.L.GOOGLE.COM`
> · `10 ALT3.ASPMX.L.GOOGLE.COM` · `10 ALT4.ASPMX.L.GOOGLE.COM`

| Tipo | Host | Valor | Qué es |
|------|------|-------|--------|
| TXT | `@` | `v=spf1 include:_spf.google.com ~all` | SPF de Google (reemplaza el de SiteGround) |
| TXT | `_dmarc` | `v=DMARC1; p=none; aspf=r; adkim=r;` | DMARC (igual al actual) |

**DKIM (recomendado, mejora la entregabilidad):** hoy no hay DKIM de Google
publicado. En **admin.google.com → Apps → Google Workspace → Gmail → Autenticar
correo electrónico**, generá la clave para granaltocr.net y agregá el TXT que te
dé Google (host tipo `google._domainkey`). No es obligatorio para que el correo
funcione, pero conviene.

> ⚠️ **No** copies el SPF viejo de SiteGround (`...dnssmarthost.net...`): al mover
> el correo a Google directo, ese deja de aplicar.

---

## Orden de ejecución (sin cortes)

### Opción A — Cloudflare (recomendada)
1. Creá cuenta en **cloudflare.com** → **Add a site** → `granaltocr.net` (plan Free).
2. Cloudflare escanea e **importa** los registros actuales. Revisá la lista.
3. **Editá** para que quede como la tabla de arriba:
   - `A @` → `216.198.79.1` (borrá el `35.212.77.162`).
   - `CNAME www` → valor de Vercel.
   - `MX @` → `smtp.google.com` (borrá los `mailspamprotection.com`).
   - `TXT @` SPF → el de Google (borrá el de SiteGround).
   - `TXT _dmarc` → dejalo como está.
   - (Web/A) poné el "proxy" (nube naranja) en **DNS only / gris** para `@` y
     `www` — Vercel maneja su propio SSL.
4. Cloudflare te da **2 nameservers** (p. ej. `xxx.ns.cloudflare.com`).
5. En **Squarespace Domains → granaltocr.net → Nameservers**, cambiá de los de
   SiteGround a los **de Cloudflare**. Guardá.
6. Esperá la propagación (minutos a pocas horas). Cloudflare te avisa "Active".

### Opción B — DNS propio de Squarespace (sin otra cuenta)
1. En **Squarespace Domains → granaltocr.net → DNS**, cambiá a **nameservers de
   Squarespace** (dejar de usar los de SiteGround).
2. En **Custom records**, creá TODOS los registros de las tablas de arriba
   (web + correo). Asegurate de incluir los MX y el SPF de Google.

---

## Verificación (después de propagar)

1. **dnschecker.org**: `granaltocr.net` tipo A → `216.198.79.1`; tipo MX →
   `smtp.google.com`.
2. **Vercel → proyecto granalto-web → Settings → Domains**: pasa de "Invalid
   Configuration" a **válido** (SSL automático).
3. Abrí `https://granaltocr.net` → redirige a `https://www.granaltocr.net` con la
   web nueva y candado (HTTPS).
4. **Correo:** enviá y recibí un correo de prueba con tu cuenta @granaltocr.net.

## Rollback
Si algo sale mal, volvé a poner en Squarespace los **nameservers de SiteGround**
(`ns1.siteground.net`, `ns2.siteground.net`). En un rato regresa al estado
anterior.

## Después de migrar (opcional)
- La web vieja y el filtro de correo de SiteGround quedan sin uso; podés darlos
  de baja con la agencia cuando quieras (ya no dependés de ellos).
