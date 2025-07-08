import { getProduct } from "@entities/product";
import ProductPage from "../../../page/product-page/ui/product-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  return <ProductPage product={product.product} />;
}
