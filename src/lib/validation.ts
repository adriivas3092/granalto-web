/**
 * Validación del formulario de contacto, compartida entre el cliente
 * (feedback inmediato) y el endpoint /api/contact (validación autoritativa).
 * Sin dependencias externas para mantener el bundle liviano.
 */

export const clientTypes = [
  "Cliente residencial",
  "Arquitecto o diseñador",
  "Constructora",
  "Fabricante de mobiliario",
  "Otro",
] as const;

export const projectTypes = [
  "Cocina",
  "Baño",
  "Hogar",
  "Proyecto comercial",
  "Compra de material",
  "Productos Tenax",
  "Wilsonart",
  "Otro",
] as const;

export const provinces = [
  "San José",
  "Alajuela",
  "Cartago",
  "Heredia",
  "Guanacaste",
  "Puntarenas",
  "Limón",
  "Fuera de Costa Rica",
] as const;

export type ContactFormData = {
  fullName: string;
  email: string;
  phone: string;
  clientType: string;
  projectType: string;
  province: string;
  message: string;
  consent: boolean;
  /** Honeypot: debe llegar vacío. Los bots suelen completarlo. */
  website?: string;
};

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d\s()-]{8,20}$/;

export function validateContactForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!data.fullName || data.fullName.trim().length < 3) {
    errors.fullName = "Ingrese su nombre completo.";
  }
  if (!data.email || !EMAIL_RE.test(data.email.trim())) {
    errors.email = "Ingrese un correo electrónico válido.";
  }
  if (!data.phone || !PHONE_RE.test(data.phone.trim())) {
    errors.phone = "Ingrese un número de teléfono válido.";
  }
  if (!clientTypes.includes(data.clientType as (typeof clientTypes)[number])) {
    errors.clientType = "Seleccione el tipo de cliente.";
  }
  if (!projectTypes.includes(data.projectType as (typeof projectTypes)[number])) {
    errors.projectType = "Seleccione el tipo de proyecto.";
  }
  if (!data.province) {
    errors.province = "Seleccione su ubicación o provincia.";
  }
  if (!data.message || data.message.trim().length < 10) {
    errors.message = "Cuéntenos brevemente sobre su proyecto (mínimo 10 caracteres).";
  }
  if (data.message && data.message.length > 3000) {
    errors.message = "El mensaje es demasiado largo (máximo 3000 caracteres).";
  }
  if (!data.consent) {
    errors.consent = "Debe aceptar la política de privacidad para continuar.";
  }

  return errors;
}

export function isSpam(data: ContactFormData): boolean {
  return Boolean(data.website && data.website.trim().length > 0);
}
