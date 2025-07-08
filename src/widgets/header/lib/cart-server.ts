import { cookies } from "next/headers";
import { ICartResponse } from "@shared/types";

/**
 * Получить количество товаров в корзине для SSR
 * Эта функция может использоваться только в серверных компонентах
 */
export async function getCartItemsCountSSR(): Promise<number> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("cart-session-id")?.value;

    if (!sessionId) {
      return 0;
    }

    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/";

    const response = await fetch(`${API_BASE_URL}cart?sessionId=${sessionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Всегда получать свежие данные
    });

    if (!response.ok) {
      return 0;
    }

    const data: ICartResponse = await response.json();
    return data.cart.totalItems || 0;
  } catch (error) {
    console.error("Failed to get cart items count for SSR:", error);
    return 0;
  }
}
