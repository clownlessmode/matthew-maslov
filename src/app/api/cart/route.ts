import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { ICartItem, ICartResponse, IAddToCartRequest } from "@shared/types";
import { IProduct } from "@entities/product";
import {
  cartsStorage,
  createEmptyCart,
  recalculateCart,
  getCartBySessionId,
} from "@shared/lib/cart-storage";

// Мок данные продуктов (используем те же что в products API)
const mockProducts: IProduct[] = [
  {
    id: "1",
    images: ["/assets/products/jacket/1.webp"],
    price: 10700,
    title: "BAGGY-JORTS \n«OIL TRANSFORMER»",
    shortTitle: "BAGGY-JORTS",
    sizes: ["S", "M", "L", "XL"],
    features: [],
    composition: ["100% хлопок, 360 гр."],
  },
  {
    id: "2",
    images: ["/assets/products/jacket/1.webp"],
    price: 8900,
    title: "OVERSIZED HOODIE \n«METAMORPHOSIS»",
    shortTitle: "OVERSIZED HOODIE",
    sizes: ["M", "L", "XL", "XXL"],
    features: [],
    composition: ["80% хлопок, 20% полиэстер, 420 гр."],
  },
  {
    id: "3",
    images: ["/assets/products/jacket/1.webp"],
    price: 12500,
    title: "CARGO PANTS \n«URBAN ARCHITECT»",
    shortTitle: "CARGO PANTS",
    sizes: ["S", "M", "L", "XL"],
    features: [],
    composition: ["65% хлопок, 35% нейлон рипстоп, 340 гр."],
  },
  {
    id: "4",
    images: ["/assets/products/jacket/1.webp"],
    price: 15700,
    title: "TECH VEST \n«CYBER GUARDIAN»",
    shortTitle: "TECH VEST",
    sizes: ["M", "L", "XL"],
    features: [],
    composition: ["Нейлон таслан, мембрана, неопрен"],
  },
  {
    id: "5",
    images: ["/assets/products/jacket/1.webp"],
    price: 18900,
    title: "MULTI-JACKET \n«SYSTEM OVERRIDE»",
    shortTitle: "MULTI-JACKET",
    sizes: ["S", "M", "L", "XL", "XXL"],
    features: [],
    composition: ["Нейлон рипстоп, мембрана Gore-Tex, утеплитель Thinsulate"],
  },
];

// Получить или создать сессию корзины
async function getOrCreateCartSession(request?: NextRequest): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("cart-session-id")?.value;

  // Для SSR: проверить GET параметр sessionId
  if (!sessionId && request) {
    const url = new URL(request.url);
    sessionId = url.searchParams.get("sessionId") || undefined;
  }

  if (!sessionId) {
    sessionId = uuidv4();
  }

  return sessionId;
}

// GET - получить корзину
export async function GET(
  request: NextRequest
): Promise<NextResponse<ICartResponse>> {
  try {
    const sessionId = await getOrCreateCartSession(request);
    const cart = getCartBySessionId(sessionId);

    const response = NextResponse.json({
      cart,
      success: true,
    });

    // Установить cookie с session ID
    response.cookies.set("cart-session-id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 дней
    });

    return response;
  } catch (error) {
    console.error("Failed to get cart:", error);
    return NextResponse.json(
      { cart: createEmptyCart(""), success: false },
      { status: 500 }
    );
  }
}

// POST - добавить товар в корзину
export async function POST(
  request: NextRequest
): Promise<NextResponse<ICartResponse>> {
  try {
    const body: IAddToCartRequest = await request.json();
    const { productId, size, quantity = 1 } = body;

    // Валидация
    if (!productId || !size) {
      return NextResponse.json(
        { cart: createEmptyCart(""), success: false },
        { status: 400 }
      );
    }

    // Найти продукт
    const product = mockProducts.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { cart: createEmptyCart(""), success: false },
        { status: 404 }
      );
    }

    const sessionId = await getOrCreateCartSession(request);
    const cart = getCartBySessionId(sessionId);

    // Проверить, есть ли уже такой товар в корзине
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId && item.size === size
    );

    if (existingItemIndex >= 0) {
      // Обновить количество существующего товара
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Добавить новый товар
      const newItem: ICartItem = {
        id: uuidv4(),
        productId,
        title: product.title,
        shortTitle: product.shortTitle,
        price: product.price,
        size,
        quantity,
        image: product.images[0],
      };
      cart.items.push(newItem);
    }

    recalculateCart(cart);
    cartsStorage.set(sessionId, cart);

    const response = NextResponse.json({
      cart,
      success: true,
    });

    // Установить cookie с session ID
    response.cookies.set("cart-session-id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 дней
    });

    return response;
  } catch (error) {
    console.error("Failed to add to cart:", error);
    return NextResponse.json(
      { cart: createEmptyCart(""), success: false },
      { status: 500 }
    );
  }
}

// DELETE - очистить корзину
export async function DELETE(
  _request: NextRequest
): Promise<NextResponse<ICartResponse>> {
  try {
    const sessionId = await getOrCreateCartSession();
    const cart = createEmptyCart(sessionId);
    cartsStorage.set(sessionId, cart);

    const response = NextResponse.json({
      cart,
      success: true,
    });

    return response;
  } catch (error) {
    console.error("Failed to clear cart:", error);
    return NextResponse.json(
      { cart: createEmptyCart(""), success: false },
      { status: 500 }
    );
  }
}
