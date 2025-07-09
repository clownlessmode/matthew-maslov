"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IProduct } from "@entities/product";
import { CartItem } from "@shared/types/cart";

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (
    product: IProduct,
    selectedSize: IProduct["sizes"][number],
    quantity?: number
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  increaseQuantity: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function calculateTotals(items: CartItem[]) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { totalItems, totalPrice };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addToCart: (product, selectedSize, quantity = 1) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (item) =>
            item.productId === product.id && item.selectedSize === selectedSize
        );

        let updatedItems: CartItem[];

        if (existingItemIndex >= 0) {
          // Обновляем количество существующего товара
          updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += quantity;
        } else {
          // Добавляем новый товар
          const newItem: CartItem = {
            ...product,
            id: generateId(),
            productId: product.id,
            selectedSize,
            quantity,
          };
          updatedItems = [...currentItems, newItem];
        }

        const { totalItems, totalPrice } = calculateTotals(updatedItems);
        set({ items: updatedItems, totalItems, totalPrice });
      },

      removeFromCart: (itemId) => {
        const updatedItems = get().items.filter((item) => item.id !== itemId);
        const { totalItems, totalPrice } = calculateTotals(updatedItems);
        set({ items: updatedItems, totalItems, totalPrice });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }

        const updatedItems = get().items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );
        const { totalItems, totalPrice } = calculateTotals(updatedItems);
        set({ items: updatedItems, totalItems, totalPrice });
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },

      increaseQuantity: (itemId) => {
        const item = get().items.find((item) => item.id === itemId);
        if (item) {
          get().updateQuantity(itemId, item.quantity + 1);
        }
      },

      decreaseQuantity: (itemId) => {
        const item = get().items.find((item) => item.id === itemId);
        if (item) {
          get().updateQuantity(itemId, item.quantity - 1);
        }
      },
    }),
    {
      name: "matthew-maslow-cart",
      storage: createJSONStorage(() => {
        // SSR-safe storage
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
    }
  )
);
