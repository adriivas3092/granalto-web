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
