export type Category = {
  id: string;
  name: string;
  slug: string;
  position: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  category_id: string | null;
  description: string | null;
  price: number;
  currency: string;
  compare_at_price: number | null;
  stock: number;
  available: boolean;
  featured: boolean;
  image_url: string | null;
  gallery: string[];
  attributes: Record<string, string>;
  created_at: string;
  updated_at: string;
};

export type OrderStatus =
  | "pendiente"
  | "pagado"
  | "en_proceso"
  | "enviado"
  | "entregado"
  | "cancelado";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: "Pendiente de pago",
  pagado: "Pagado",
  en_proceso: "En proceso",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_slug: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
};

export type Order = {
  id: string;
  customer_id: string;
  status: OrderStatus;
  currency: string;
  subtotal: number;
  total: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Opcional: cargado con join.
  items?: OrderItem[];
};

/** Perfil del cliente (datos de contacto/envío). */
export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
};

/** Ítem del carrito (estado local en el navegador). */
export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  image_url: string | null;
  quantity: number;
};

export type ProductInput = {
  name: string;
  slug: string;
  sku: string | null;
  category_id: string | null;
  description: string | null;
  price: number;
  currency: string;
  compare_at_price: number | null;
  stock: number;
  available: boolean;
  featured: boolean;
  image_url: string | null;
  gallery: string[];
  attributes: Record<string, string>;
};
