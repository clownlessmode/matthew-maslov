"use server";
import { cookies } from "next/headers";
import { CartItem, Cart, AddToCartParams } from "@shared/types/cart";

const CART_COOKIE_NAME = "matthew-maslow-cart";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Helper function to generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Calculate cart totals
function calculateCartTotals(items: CartItem[]): {
  totalItems: number;
  totalPrice: number;
} {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { totalItems, totalPrice };
}

// Get cart from cookies (server-side)
export async function getCart(): Promise<Cart> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get(CART_COOKIE_NAME);

  if (!cartCookie?.value) {
    return { items: [], totalItems: 0, totalPrice: 0 };
  }

  try {
    const items: CartItem[] = JSON.parse(cartCookie.value);
    const { totalItems, totalPrice } = calculateCartTotals(items);
    return { items, totalItems, totalPrice };
  } catch {
    return { items: [], totalItems: 0, totalPrice: 0 };
  }
}

// Save cart to cookies (server-side)
async function saveCart(items: CartItem[]): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(items), {
    maxAge: CART_COOKIE_MAX_AGE,
    httpOnly: false, // Allow client-side access for immediate updates
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

// Add item to cart
export async function addToCart(params: AddToCartParams): Promise<Cart> {
  const currentCart = await getCart();
  const { productId, title, price, image, size, quantity = 1 } = params;

  // Check if item already exists (same product and size)
  const existingItemIndex = currentCart.items.findIndex(
    (item) => item.productId === productId && item.size === size
  );

  let updatedItems: CartItem[];

  if (existingItemIndex >= 0) {
    // Update quantity of existing item
    updatedItems = [...currentCart.items];
    updatedItems[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    const newItem: CartItem = {
      id: generateId(),
      productId,
      title,
      price,
      image,
      size,
      quantity,
    };
    updatedItems = [...currentCart.items, newItem];
  }

  await saveCart(updatedItems);
  const { totalItems, totalPrice } = calculateCartTotals(updatedItems);
  return { items: updatedItems, totalItems, totalPrice };
}

// Remove item from cart
export async function removeFromCart(itemId: string): Promise<Cart> {
  const currentCart = await getCart();
  const updatedItems = currentCart.items.filter((item) => item.id !== itemId);

  await saveCart(updatedItems);
  const { totalItems, totalPrice } = calculateCartTotals(updatedItems);
  return { items: updatedItems, totalItems, totalPrice };
}

// Update item quantity
export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
): Promise<Cart> {
  const currentCart = await getCart();

  if (quantity <= 0) {
    return removeFromCart(itemId);
  }

  const updatedItems = currentCart.items.map((item) =>
    item.id === itemId ? { ...item, quantity } : item
  );

  await saveCart(updatedItems);
  const { totalItems, totalPrice } = calculateCartTotals(updatedItems);
  return { items: updatedItems, totalItems, totalPrice };
}

// Clear cart
export async function clearCart(): Promise<Cart> {
  await saveCart([]);
  return { items: [], totalItems: 0, totalPrice: 0 };
}
