import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ICartResponse,
  IUpdateCartItemRequest,
  IRemoveFromCartRequest,
} from "@shared/types";
import {
  cartsStorage,
  createEmptyCart,
  recalculateCart,
} from "@shared/lib/cart-storage";

// Получить session ID из cookies
async function getCartSession(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("cart-session-id")?.value || null;
}

// Эта функция теперь импортируется из cart-storage

// PUT - обновить количество товара в корзине
export async function PUT(
  request: NextRequest
): Promise<NextResponse<ICartResponse>> {
  try {
    const body: IUpdateCartItemRequest = await request.json();
    const { cartItemId, quantity } = body;

    if (!cartItemId || quantity < 0) {
      return NextResponse.json(
        { cart: createEmptyCart(""), success: false },
        { status: 400 }
      );
    }

    const sessionId = await getCartSession();
    if (!sessionId) {
      return NextResponse.json(
        { cart: createEmptyCart(""), success: false },
        { status: 404 }
      );
    }

    const cart = cartsStorage.get(sessionId);
    if (!cart) {
      return NextResponse.json(
        { cart: createEmptyCart(""), success: false },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex((item) => item.id === cartItemId);
    if (itemIndex === -1) {
      return NextResponse.json({ cart, success: false }, { status: 404 });
    }

    if (quantity === 0) {
      // Удалить товар если количество = 0
      cart.items.splice(itemIndex, 1);
    } else {
      // Обновить количество
      cart.items[itemIndex].quantity = quantity;
    }

    recalculateCart(cart);
    cartsStorage.set(sessionId, cart);

    return NextResponse.json({
      cart,
      success: true,
    });
  } catch (error) {
    console.error("Failed to update cart item:", error);
    return NextResponse.json(
      {
        cart: {
          id: "",
          items: [],
          totalItems: 0,
          totalPrice: 0,
          createdAt: "",
          updatedAt: "",
        },
        success: false,
      },
      { status: 500 }
    );
  }
}

// DELETE - удалить товар из корзины
export async function DELETE(
  request: NextRequest
): Promise<NextResponse<ICartResponse>> {
  try {
    const body: IRemoveFromCartRequest = await request.json();
    const { cartItemId } = body;

    if (!cartItemId) {
      return NextResponse.json(
        { cart: createEmptyCart(""), success: false },
        { status: 400 }
      );
    }

    const sessionId = await getCartSession();
    if (!sessionId) {
      return NextResponse.json(
        { cart: createEmptyCart(""), success: false },
        { status: 404 }
      );
    }

    const cart = cartsStorage.get(sessionId);
    if (!cart) {
      return NextResponse.json(
        { cart: createEmptyCart(""), success: false },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex((item) => item.id === cartItemId);
    if (itemIndex === -1) {
      return NextResponse.json({ cart, success: false }, { status: 404 });
    }

    cart.items.splice(itemIndex, 1);
    recalculateCart(cart);
    cartsStorage.set(sessionId, cart);

    return NextResponse.json({
      cart,
      success: true,
    });
  } catch (error) {
    console.error("Failed to remove cart item:", error);
    return NextResponse.json(
      {
        cart: {
          id: "",
          items: [],
          totalItems: 0,
          totalPrice: 0,
          createdAt: "",
          updatedAt: "",
        },
        success: false,
      },
      { status: 500 }
    );
  }
}
