import { ICart } from "@shared/types";

/**
 * Общее хранилище корзин для всех API endpoints
 * В реальном приложении это должна быть база данных
 */
export const cartsStorage = new Map<string, ICart>();

/**
 * Создать пустую корзину
 */
export function createEmptyCart(sessionId: string): ICart {
  const now = new Date().toISOString();
  return {
    id: sessionId,
    items: [],
    totalItems: 0,
    totalPrice: 0,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Пересчитать итоги корзины
 */
export function recalculateCart(cart: ICart): void {
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  cart.updatedAt = new Date().toISOString();
}

/**
 * Получить корзину по session ID
 */
export function getCartBySessionId(sessionId: string): ICart {
  let cart = cartsStorage.get(sessionId);
  if (!cart) {
    cart = createEmptyCart(sessionId);
    cartsStorage.set(sessionId, cart);
  }
  return cart;
}
