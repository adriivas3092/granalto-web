"use client";

import { useEffect } from "react";

/**
 * Botón/chat de Kommo (CRM). Reemplaza al botón flotante propio de WhatsApp:
 * Kommo muestra su propio botón flotante e integra WhatsApp y otros canales
 * conectados al CRM. El id/hash son credenciales públicas del widget.
 *
 * Se inyecta el bootstrap como <script> en el navegador para garantizar que
 * corra siempre. Los dominios de Kommo están autorizados en la CSP
 * (ver next.config.ts).
 */
const BOOTSTRAP =
  `(function(a,m,o,c,r,m){a[m]={id:"1083529",hash:"733a4465b467bb08c755961b5b100c966fb0c3cd8d239078c80585f4e77aa0c4",locale:"es",setMeta:function(p){this.params=(this.params||[]).concat([p])}};a[o]=a[o]||function(){(a[o].q=a[o].q||[]).push(arguments)};var d=a.document,s=d.createElement('script');s.async=true;s.id=m+'_script';s.src='https://gso.kommo.com/js/button.js';d.head&&d.head.appendChild(s)}(window,0,'crmPlugin',0,0,'crm_plugin'));`;

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
