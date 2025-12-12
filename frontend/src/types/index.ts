export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin';
  avatar_url?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string; // From API it often comes as string due to decimal
  image_url?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  id: number;
  item: Product;
  quantity: number;
}

export interface Order {
  id: number;
  created_at: string;
  total_amount: number;
  items: OrderItem[];
}

export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_items: number;
}
