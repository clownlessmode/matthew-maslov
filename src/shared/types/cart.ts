export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface AddToCartParams {
  productId: string;
  title: string;
  price: number;
  image: string;
  size: string;
  quantity?: number;
}
