import { cn } from "@shared/utils/utils";
import React from "react";
import CartPageClient from "./cart-page-client";

const CartPage = () => {
  return (
    <main
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 mt-[80px] lg:mt-[60px] gap-4 min-h-[calc(100svh-30px)]",
        "p-5",
        "sm:p-10 ",
        "lg:p-15",
        "xl:p-20",
        "2xl:p-25"
      )}
    >
      <CartPageClient />
    </main>
  );
};

export default CartPage;
