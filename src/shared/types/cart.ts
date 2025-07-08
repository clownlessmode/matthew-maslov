export interface ICartItem {
  id: string;
  productId: string;
  title: string;
  shortTitle: string;
  price: number;
  size: "S" | "M" | "L" | "XL" | "XXL";
  quantity: number;
  image: string;
}

export interface ICart {
  id: string;
  items: ICartItem[];
  totalItems: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICartResponse {
  cart: ICart;
  success: boolean;
}

export interface ICartsResponse {
  carts: ICart[];
  success: boolean;
}

export interface IAddToCartRequest {
  productId: string;
  size: "S" | "M" | "L" | "XL" | "XXL";
  quantity?: number;
}

export interface IUpdateCartItemRequest {
  cartItemId: string;
  quantity: number;
}

export interface IRemoveFromCartRequest {
  cartItemId: string;
} 