import { IProduct } from "@entities/product";

export interface CartItem extends Omit<IProduct, "sizes"> {
  productId: string; // ID оригинального продукта
  selectedSize: IProduct["sizes"][number];
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
