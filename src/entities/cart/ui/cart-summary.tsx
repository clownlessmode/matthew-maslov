"use client";
import { ICart } from "@shared/types";
import { Button } from "@shared/ui/button";
import { cn, formatPrice } from "@shared/utils/utils";
import React, { FC } from "react";

interface CartSummaryProps {
  cart: ICart;
  onClearCart: () => Promise<void>;
  onCheckout?: () => void;
  isUpdating?: boolean;
  className?: string;
}

export const CartSummary: FC<CartSummaryProps> = ({
  cart,
  onClearCart,
  onCheckout,
  isUpdating = false,
  className,
}) => {
  const handleClearCart = async () => {
    if (confirm("Вы уверены, что хотите очистить корзину?")) {
      try {
        await onClearCart();
      } catch (error) {
        console.error("Failed to clear cart:", error);
      }
    }
  };

  if (cart.items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "sticky bottom-0 bg-background border-t border-border p-4",
        "sm:relative sm:border sm:rounded-2xl sm:bg-muted/30",
        isUpdating && "opacity-50 pointer-events-none",
        className
      )}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Товаров в корзине:
            </span>
            <span className="font-medium">{cart.totalItems} шт.</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Итого:</span>
            <span className="text-lg font-bold">
              {formatPrice(cart.totalPrice)} ₽
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {onCheckout && (
            <Button
              className="w-full"
              size="lg"
              onClick={onCheckout}
              disabled={isUpdating}
            >
              Оформить заказ
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={handleClearCart}
            disabled={isUpdating}
          >
            Очистить корзину
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Стоимость доставки рассчитывается при оформлении заказа
        </div>
      </div>
    </div>
  );
};
