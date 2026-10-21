# Manual base: cómo y qué hacemos para crear una web

> Documento base (playbook) de Granalto. Resume el **stack**, las **fases** y el
> **checklist mínimo** que toda web debe cumplir para salir en línea funcionando
> bien, segura y lista para crecer. Sirve como estándar para esta web y para las
> próximas.

---

## 1. Stack base (con qué se construye)

| Capa | Tecnología | Por qué |
|---|---|---|
| Framework | **Next.js** (App Router) + **React** + **TypeScript** | Rápido, moderno, SEO-friendly, escalable |
| Estilos | **Tailwind CSS** | Diseño consistente y responsive |
| Base de datos + Auth | **Supabase** (PostgreSQL + Auth + RLS) | Datos, usuarios y permisos seguros |
| Hosting / Deploy | **Vercel** (CI/CD desde GitHub) | HTTPS automático, despliegue continuo, CDN global |
| Correo | **Resend** (SMTP/API) | Correos transaccionales (pedidos, recuperación) |
| Control de versiones | **Git + GitHub** | Historial, respaldo del código, colaboración |

**Principio:** cada cambio se versiona en Git y se despliega automático en Vercel.
El código es, en sí mismo, un respaldo con historial.

---

## 2. Fases para crear una web

1. **Descubrimiento** — objetivos, público, páginas, funciones (tienda, cotizador,
   formularios), identidad visual, dominio y correos.
2. **Diseño** — estructura (wireframe), paleta, tipografía, componentes. Mobile-first.
3. **Desarrollo** — páginas, componentes, base de datos, panel admin, integraciones.
4. **Contenido** — textos, fotos, materiales, SEO on-page por página.
5. **Seguridad** — RLS, permisos de admin, headers, validación, variables de entorno.
6. **SEO y analítica** — sitemap, robots, metadatos, Analytics, Search Console.
7. **Legal** — política de privacidad, cookies, términos, recolección de datos.
8. **Pruebas** — responsive, velocidad, formularios, pagos, errores.
9. **Publicación / migración** — apuntar el dominio, HTTPS, redirecciones del sitio viejo.
10. **Mantenimiento** — backups, monitoreo de errores, actualizaciones, métricas.

---

## 3. Checklist mínimo (lo que toda web debe tener)

### Infraestructura y rendimiento
- **Certificado SSL (HTTPS):** automático en Vercel al apuntar el dominio.
- **Diseño responsive:** mobile-first con Tailwind; probar en teléfono, tablet y escritorio.
- **Velocidad de carga:** imágenes optimizadas (AVIF/WebP), carga diferida, CDN de Vercel,
  render estático donde se pueda. Medir con PageSpeed Insights.
- **Backups automáticos:**
  - Código → GitHub (historial completo).
  - Base de datos → backups automáticos de Supabase (según plan; activar PITR en plan Pro).
  - Exportación periódica de tablas críticas como respaldo adicional.

### Seguridad
- **Acceso de administrador:** panel protegido por login (Supabase Auth) + control de
  permisos en servidor (`requireAdmin`) + **RLS** en la base de datos.
- **Headers de seguridad HTTP:** HSTS, X-Frame-Options (anti-clickjacking),
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy y CSP.
- **Firewall / protección:** Vercel brinda protección de borde y anti-DDoS; activar el
  Firewall/WAF de Vercel para reglas adicionales.
- **Protección de vulnerabilidades:** validación de entradas (Zod), rate-limiting en APIs,
  honeypot anti-spam en formularios, `npm audit` de dependencias, sin secretos en el código.
- **Variables de entorno:** las llaves secretas (service role, API keys) viven SOLO en
  Vercel, nunca en el repositorio ni en el chat.

### Autenticación
- **Login con usuario/contraseña** + **recuperación de contraseña** por correo.
- **Login con Google (OAuth):** opción recomendada para clientes (vía Supabase Auth).

### SEO y descubrimiento
- **SEO on-page:** título y descripción por página, Open Graph/Twitter, canonical,
  datos estructurados (JSON-LD) y URLs limpias.
- **sitemap.xml** y **robots.txt** generados automáticamente.
- **Google Analytics (GA4)** para medir tráfico y conversiones.
- **Google Search Console** para indexación, errores y envío del sitemap.
- **Favicon** e íconos (incluido apple-touch-icon).

### Contacto y conversión
- **Formulario de contacto** con validación, anti-spam y envío a un destino real
  (correo/CRM/webhook).
- **Botón de WhatsApp** flotante y en puntos clave.
- **Llamados a la acción** claros (cotizar, comprar, contactar).

### Legal y privacidad
- **Aviso de cookies** (banner) con consentimiento.
- **Política de privacidad.**
- **Política de recolección y tratamiento de datos** (qué se recoge, para qué, base legal,
  derechos del usuario). En CR, alineada a la Ley 8968.
- **Términos y condiciones.**

### Analítica y monitoreo
- **Panel de analíticas** interno (ventas, pedidos, métricas del negocio).
- **Registro de errores (monitoreo):** herramienta que captura errores en producción
  (p. ej. Sentry) + logs de Vercel, para enterarse de fallos antes que el cliente.

---

## 4. Seguridad en detalle (cómo lo hacemos)

- **RLS (Row Level Security)** en todas las tablas: cada quien ve/edita solo lo que le
  corresponde; la escritura de admin exige `is_admin()`.
- **Separación de llaves:** la llave pública (anon) puede ir embebida (protegida por RLS);
  la **service_role** solo en el servidor/Vercel.
- **Headers** definidos en la configuración del framework.
- **Validación** de todo lo que entra por formularios y APIs.
- **Rate-limiting** para frenar abuso en endpoints públicos.
- **Dependencias** revisadas y actualizadas (`npm audit`).

---

## 5. Publicación / migración del dominio

1. Agregar el dominio en Vercel → obtener los registros DNS exactos.
2. En el proveedor de DNS, apuntar solo los registros web:
   - `A` raíz (`@`) → IP de Vercel.
   - `CNAME` `www` → `cname.vercel-dns.com`.
3. **No tocar** los registros de correo (MX/SPF/DKIM).
4. Bajar el TTL antes del cambio para propagar rápido y poder revertir.
5. HTTPS se emite solo en Vercel al apuntar el dominio.
6. Configurar **redirecciones** desde las URLs del sitio anterior (evita 404 y conserva SEO).
7. Mantener el sitio viejo encendido hasta confirmar la propagación.

---

## 6. Mantenimiento (después de publicar)

- Revisar **errores** (monitoreo) y **métricas** (Analytics) con regularidad.
- **Backups** verificados (que realmente se puedan restaurar).
- **Actualizaciones** de dependencias y del framework.
- **Contenido** al día (blog, productos, materiales).
- Revisión periódica de **seguridad** y **velocidad**.

---

## 7. Resumen de requisitos antes de salir en línea

- [ ] HTTPS activo
- [ ] Responsive verificado en móvil/escritorio
- [ ] Velocidad aceptable (PageSpeed)
- [ ] Backups configurados y probados
- [ ] Admin protegido (Auth + RLS)
- [ ] Headers de seguridad + firewall
- [ ] Validación y rate-limiting
- [ ] SEO on-page + sitemap + robots + favicon
- [ ] Google Analytics + Search Console
- [ ] Formulario de contacto conectado a destino real
- [ ] Botón de WhatsApp
- [ ] Aviso de cookies + política de privacidad + recolección de datos + términos
- [ ] Login (contraseña + Google) + recuperación
- [ ] Registro de errores (monitoreo) activo
- [ ] Dominio apuntado + redirecciones del sitio viejo
