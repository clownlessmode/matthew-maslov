"use client";
import { useCartStore } from "@shared/stores/cart.store";
import { MobileNavigation } from "./mobile-navigation";
import { DesktopNavigation } from "./desktop-navigation";

export const CartInfo = () => {
  const totalItems = useCartStore((state) => state.totalItems);

  return (
    <>
      <MobileNavigation cartItemsCount={totalItems} />
      <DesktopNavigation cartItemsCount={totalItems} />
    </>
  );
};
