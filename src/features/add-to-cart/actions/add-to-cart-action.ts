"use server";
import { addToCart } from "@shared/lib";
import { AddToCartParams } from "@shared/types";
import { revalidatePath } from "next/cache";

export async function addToCartAction(params: AddToCartParams) {
  try {
    const result = await addToCart(params);

    // Revalidate the paths that might show cart data
    revalidatePath("/");
    revalidatePath("/products/[id]", "page");
    revalidatePath("/cart");

    return result;
  } catch (error) {
    console.error("Failed to add to cart:", error);
    throw new Error("Failed to add item to cart");
  }
}
