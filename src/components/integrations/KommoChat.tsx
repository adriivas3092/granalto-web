"use client";

import { useEffect } from "react";

/**
 * Botón/chat de Kommo (CRM). Reemplaza al botón flotante propio de WhatsApp:
 * Kommo muestra su propio botón flotante e integra WhatsApp y otros canales
 * conectados al CRM. El id/hash son credenciales públicas del widget.
 *
 * ACTUALMENTE NO SE USA: en Kommo el botón está ligado a otro número de
 * WhatsApp (+506 6219-1959). El sitio muestra <WhatsAppButton /> (6090-3269).
 * Para volver a Kommo, renderizar <KommoChat /> en src/app/layout.tsx.
 *
 * Se inyecta el bootstrap como <script> en el navegador para garantizar que
 * corra siempre. Los dominios de Kommo están autorizados en la CSP
 * (ver next.config.ts).
 */
const BOOTSTRAP =
  `(function(a,m,o,c,r,m){a[m]={id:"1083517",hash:"3df9a225431a0c2ccdb6037336a7cf29defbe476a14c0b97ff4d1c36e0c45338",locale:"es",setMeta:function(p){this.params=(this.params||[]).concat([p])}};a[o]=a[o]||function(){(a[o].q=a[o].q||[]).push(arguments)};var d=a.document,s=d.createElement('script');s.async=true;s.id=m+'_script';s.src='https://gso.kommo.com/js/button.js';d.head&&d.head.appendChild(s)}(window,0,'crmPlugin',0,0,'crm_plugin'));`;

export function KommoChat() {
  useEffect(() => {
    if (document.getElementById("kommo-bootstrap")) return;
    const s = document.createElement("script");
    s.id = "kommo-bootstrap";
    s.textContent = BOOTSTRAP;
    document.body.appendChild(s);
  }, []);

  return null;
}
