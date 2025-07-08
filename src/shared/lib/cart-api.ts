import {
  ICartResponse,
  IAddToCartRequest,
  IUpdateCartItemRequest,
  IRemoveFromCartRequest,
} from "@shared/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export class CartAPI {
  /**
   * Получить корзину по ID сессии
   */
  static async getCart(sessionId?: string): Promise<ICartResponse> {
    const url = `${API_BASE_URL}cart${
      sessionId ? `?sessionId=${sessionId}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Для работы с cookies
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cart: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Добавить товар в корзину
   */
  static async addToCart(data: IAddToCartRequest): Promise<ICartResponse> {
    const response = await fetch(`${API_BASE_URL}cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to add to cart: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Обновить количество товара в корзине
   */
  static async updateCartItem(
    data: IUpdateCartItemRequest
  ): Promise<ICartResponse> {
    const response = await fetch(`${API_BASE_URL}cart/items`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update cart item: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Удалить товар из корзины
   */
  static async removeFromCart(
    data: IRemoveFromCartRequest
  ): Promise<ICartResponse> {
    const response = await fetch(`${API_BASE_URL}cart/items`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to remove from cart: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Очистить корзину
   */
  static async clearCart(): Promise<ICartResponse> {
    const response = await fetch(`${API_BASE_URL}cart`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to clear cart: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Получить количество товаров в корзине (для SSR)
   */
  static async getCartItemsCount(sessionId?: string): Promise<number> {
    try {
      const cartResponse = await this.getCart(sessionId);
      return cartResponse.cart.totalItems;
    } catch (error) {
      console.error("Failed to get cart items count:", error);
      return 0;
    }
  }
}
