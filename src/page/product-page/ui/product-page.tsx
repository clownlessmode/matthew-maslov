"use client";
import { IProduct } from "@entities/product";
import { AddToCart } from "@features/add-to-cart";
import { SizeSelector } from "@features/size-selector";
import { Blot } from "@shared/assets/blot";
import { cn, formatPrice } from "@shared/utils/utils";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useState } from "react";

interface Props {
  product: IProduct;
}

const ProductPage: FC<Props> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes[0] || ""
  );

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };
  return (
    <>
      <main
        className={cn(
          "lg:grid hidden grid-cols-10 mt-[80px] gap-4",
          "p-5",
          "sm:p-10 ",
          "lg:p-15",
          "xl:p-20",
          "2xl:p-25"
        )}
      >
        <div className="flex flex-col justify-between h-full gap-[20px]">
          {product.images.slice(0, -1).map((item, index) => (
            <Image
              key={index}
              src={item}
              alt={"product"}
              width={1000 * 3}
              height={1000 * 3}
              className=" w-full h-[calc(100vh-120px)] sm:h-auto aspect-square object-cover overflow-hidden rounded-2xl"
            />
          ))}
        </div>
        <section className="col-span-4 lg:p-8 rounded-2xl p-5 border border-border min-h-[450px] sm:min-h-[550px] flex flex-col justify-between items-center">
          <h1 className="text-2xl font-semibold text-center sm:text-4xl">
            {product.title}
          </h1>
          <p className="text-2xl font-semibold text-center sm:text-4xl">
            {formatPrice(product.price)} ₽
          </p>
          <div className="flex flex-col gap-6 justify-center items-center">
            <SizeSelector
              sizes={product.sizes}
              onSizeChange={handleSizeChange}
            />
            <Link
              href={"/sizes"}
              className="text-sm sm:text-lg font-semibold underline uppercase text-muted-foreground"
            >
              Размерная сетка
            </Link>
          </div>
          <p className="text-sm sm:text-base font-semibold uppercase text-center">
            Состав: {product.composition.join(", ")}
          </p>
          <AddToCart
            productId={product.id}
            title={product.title}
            price={product.price}
            image={product.images[0]}
            selectedSize={selectedSize}
          />
        </section>
        <Image
          src={product.images[0]}
          alt={product.title}
          width={1000 * 3}
          height={1000 * 3}
          className="w-full col-span-5 h-[calc(100vh-120px)] sm:h-auto aspect-square object-cover overflow-hidden rounded-2xl"
        />
        <section className="col-span-4 col-start-2 rounded-2xl p-5 lg:p-8 border border-border flex flex-col justify-between items-center uppercase">
          <h1 className="text-2xl sm:text-4xl font-semibold text-center">
            особенности
          </h1>
          <ul className="flex flex-col gap-7 mt-9 sm:text-lg">
            {product.features.map((feature) => (
              <li key={feature} className="flex flex-row items-start gap-2">
                <Blot className="w-[14px]! h-[18px]! shrink-0 mt-1.5" />
                <p>{feature}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <main
        className={cn(
          "flex flex-col gap-10 lg:hidden",
          "p-5",
          "sm:p-10 ",
          "lg:p-15",
          "xl:p-20",
          "2xl:p-25"
        )}
      >
        <Image
          src={product.images[0]}
          alt={product.title}
          width={1000 * 3}
          height={1000 * 3}
          className="mt-[80px] w-full h-[calc(100vh-120px)] sm:h-auto aspect-square object-cover overflow-hidden rounded-2xl"
        />
        <section className="rounded-2xl p-5 border border-border min-h-[450px] sm:min-h-[550px] flex flex-col justify-between items-center">
          <h1 className="text-2xl font-semibold text-center sm:text-4xl">
            {product.title}
          </h1>
          <p className="text-2xl font-semibold text-center sm:text-4xl">
            {formatPrice(product.price)} ₽
          </p>
          <div className="flex flex-col gap-6 justify-center items-center">
            <SizeSelector
              sizes={product.sizes}
              onSizeChange={handleSizeChange}
            />
            <Link
              href={"/sizes"}
              className="text-sm sm:text-lg font-semibold underline uppercase text-muted-foreground"
            >
              Размерная сетка
            </Link>
          </div>
          <p className="text-sm sm:text-base font-semibold uppercase text-center">
            Состав: {product.composition.join(", ")}
          </p>
          <AddToCart
            productId={product.id}
            title={product.title}
            price={product.price}
            image={product.images[0]}
            selectedSize={selectedSize}
          />
        </section>
        <section className="rounded-2xl p-5 border border-border flex flex-col justify-between items-center uppercase">
          <h1 className="text-2xl sm:text-4xl font-semibold text-center">
            особенности
          </h1>
          <ul className="flex flex-col gap-7 mt-9 sm:text-lg">
            {product.features.map((feature) => (
              <li key={feature} className="flex flex-row items-start gap-2">
                <Blot className="w-[14px]! h-[18px]! shrink-0 mt-1.5" />
                <p>{feature}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
};

export default ProductPage;
