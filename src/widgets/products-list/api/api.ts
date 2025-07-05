import { IProduct } from "@entities/product";

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
    throw new Error("Failed to fetch products");
  }

  return res.json();
}
