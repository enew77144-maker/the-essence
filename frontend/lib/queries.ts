import { api } from "./api";
import type {
  Banner,
  Cart,
  Category,
  Concern,
  Order,
  Paginated,
  Product,
  ProductDetail,
  Review,
  User,
} from "./types";

export const queries = {
  banners: async (): Promise<Banner[]> => {
    const { data } = await api.get<Paginated<Banner> | Banner[]>("/banners/");
    return Array.isArray(data) ? data : data.results;
  },
  concerns: async (): Promise<Concern[]> => {
    const { data } = await api.get<Paginated<Concern> | Concern[]>("/concerns/");
    return Array.isArray(data) ? data : data.results;
  },
  categories: async (): Promise<Category[]> => {
    const { data } = await api.get<Paginated<Category> | Category[]>(
      "/categories/",
    );
    return Array.isArray(data) ? data : data.results;
  },
  category: async (slug: string): Promise<Category> => {
    const { data } = await api.get<Category>(`/categories/${slug}/`);
    return data;
  },
  products: async (params: Record<string, string | number | undefined> = {}) => {
    const { data } = await api.get<Paginated<Product>>("/products/", { params });
    return data;
  },
  bestsellers: async (): Promise<Product[]> => {
    const { data } = await api.get<Product[]>("/products/bestsellers/");
    return data;
  },
  featured: async (): Promise<Product[]> => {
    const { data } = await api.get<Product[]>("/products/featured/");
    return data;
  },
  newArrivals: async (): Promise<Product[]> => {
    const { data } = await api.get<Product[]>("/products/new/");
    return data;
  },
  product: async (slug: string): Promise<ProductDetail> => {
    const { data } = await api.get<ProductDetail>(`/products/${slug}/`);
    return data;
  },
  related: async (slug: string): Promise<Product[]> => {
    const { data } = await api.get<Product[]>(`/products/${slug}/related/`);
    return data;
  },
  reviews: async (slug: string): Promise<Review[]> => {
    const { data } = await api.get<Paginated<Review> | Review[]>(
      `/products/${slug}/reviews/`,
    );
    return Array.isArray(data) ? data : data.results;
  },
  cart: async (): Promise<Cart> => {
    const { data } = await api.get<Cart>("/cart/");
    return data;
  },
  orders: async (): Promise<Paginated<Order>> => {
    const { data } = await api.get<Paginated<Order> | Order[]>("/orders/");
    if (Array.isArray(data)) {
      return { count: data.length, next: null, previous: null, results: data };
    }
    return data;
  },
  order: async (id: number | string): Promise<Order> => {
    const { data } = await api.get<Order>(`/orders/${id}/`);
    return data;
  },
  orderByNumber: async (orderNumber: string): Promise<Order> => {
    const { data } = await api.get<Order>(`/orders/by-number/${orderNumber}/`);
    return data;
  },
  me: async (): Promise<User> => {
    const { data } = await api.get<User>("/auth/me/");
    return data;
  },
};
