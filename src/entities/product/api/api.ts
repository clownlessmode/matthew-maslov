import { IProduct } from "@entities/product";
import { notFound } from "next/navigation";

export async function getProducts(): Promise<{
  products: IProduct[];
  total: number;
  success: boolean;
}> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}products`, {
    cache: "force-cache",
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    notFound();
    // throw new Error("Failed to fetch products");
  }

  return res.json();
}

export async function getProduct(id: string): Promise<{
  product: IProduct;
  success: boolean;
}> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}products/${id}`, {
    cache: "force-cache",
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    notFound();

    // throw new Error("Failed to fetch product");
  }

  return res.json();
}
