import { Product } from "@entities/product";
import { getProducts } from "@widgets/products-list";
import { cn } from "@shared/utils/utils";

export const ProductsList = async () => {
  const products = await getProducts();
  return (
    <section
      className={cn(
        "grid",
        "grid-cols-1 px-5 gap-[60px]",
        "lg:grid-cols-2",
        "2xl:grid-cols-3",
        "p-5",
        "sm:p-10 ",
        "lg:p-15",
        "xl:p-20",
        "2xl:p-25"
      )}
    >
      {products.products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </section>
  );
};
