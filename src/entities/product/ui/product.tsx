import { FC } from "react";
import { IProduct } from "@entities/product";
import { cn } from "@shared/utils/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
  product: IProduct;
}

export const Product: FC<Props> = ({ product }) => {
  return (
    <Link href={`/products/${product.id}`}>
      <article className={cn("flex flex-col w-full", "gap-4")}>
        <Image
          src={product.images[0]}
          alt={product.title}
          width={1000 * 3}
          height={1000 * 3}
          className="w-full h-auto aspect-square object-cover overflow-hidden rounded-2xl"
        />
        <div className="flex justify-between items-center text-[20px] sm:text-[32px] 2xl:text-[36px] tracking-tighter font-semibold">
          <h3>{product.shortTitle}</h3>
          <p className="text-muted-foreground text-right">
            {product.price.toLocaleString().replace(",", " ")} ₽
          </p>
        </div>
      </article>
    </Link>
  );
};
