export type ImageRef = { url: string; alt_text?: string };

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  parent: number | null;
  display_order: number;
  product_count?: number;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  key_ingredients: string;
  sku: string;
  price: string;
  compare_price: string | null;
  is_on_sale: boolean;
  discount_percent: number;
  stock_qty: number;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  category_name: string;
  category_slug: string;
  rating_avg: string | number;
  rating_count: number;
  primary_image: ImageRef | null;
  tags: string[];
  concerns: string[];
};

export type ProductImage = {
  id: number;
  url: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
};

export type ProductDetail = Product & {
  description: string;
  ingredients: string;
  how_to_use: string;
  images: ProductImage[];
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: number;
  product?: number;
  user?: number | null;
  user_name: string;
  author_name: string;
  rating: number;
  title: string;
  body: string;
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
};

export type CartItem = {
  id: number;
  product: Product;
  quantity: number;
  unit_price: string;
  line_total: string;
  created_at: string;
};

export type Cart = {
  id: number;
  items: CartItem[];
  subtotal: string;
  shipping_cost: string;
  discount_amount: string;
  total: string;
  item_count: number;
  discount_code: string;
  free_shipping_threshold: string;
  updated_at: string;
  session_id?: string;
};

export type Banner = {
  id: number;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_url: string;
  image_url: string;
  mobile_image_url: string;
  display_order: number;
};

export type Concern = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
};

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  role: "customer" | "admin";
  created_at: string;
};

export type Address = {
  id: number;
  label: string;
  line1: string;
  line2: string;
  city: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
};

export type OrderItem = {
  id: number;
  product: number | null;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: string;
  total_price: string;
};

export type Order = {
  id: number;
  order_number: string;
  email: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: string;
  shipping_cost: string;
  discount_amount: string;
  total: string;
  shipping_address: Record<string, string>;
  billing_address: Record<string, string>;
  stripe_payment_status: string;
  notes: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
