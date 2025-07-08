"use client";
import { ICartItem } from "@shared/types";
import { Button } from "@shared/ui/button";
import { cn, formatPrice } from "@shared/utils/utils";
import Image from "next/image";
import React, { FC, useState } from "react";

interface CartItemProps {
  item: ICartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
  isUpdating?: boolean;
}

export const CartItem: FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
}) => {
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;

    setIsLoading(true);
    setLocalQuantity(newQuantity);

    try {
      await onUpdateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      setLocalQuantity(item.quantity); // Rollback on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      await onRemove(item.id);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const itemTotal = item.price * localQuantity;

  return (
    <div
      className={cn(
        "flex gap-4 p-4 border border-border rounded-2xl",
        (isUpdating || isLoading) && "opacity-50 pointer-events-none"
      )}
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover rounded-xl"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
            {item.shortTitle}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Размер: {item.size}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(localQuantity - 1)}
              disabled={localQuantity <= 1 || isLoading}
              className="w-8 h-8 p-0 rounded-lg"
            >
              -
            </Button>
            <span className="text-sm font-medium w-8 text-center">
              {localQuantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(localQuantity + 1)}
              disabled={isLoading}
              className="w-8 h-8 p-0 rounded-lg"
            >
              +
            </Button>
          </div>

          <div className="text-right">
            <p className="font-semibold text-sm sm:text-base">
              {formatPrice(itemTotal)} ₽
            </p>
            {localQuantity > 1 && (
              <p className="text-xs text-muted-foreground">
                {formatPrice(item.price)} ₽ за шт.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={isLoading}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 w-8 h-8 p-0"
        >
          ×
        </Button>
      </div>
    </div>
  );
};
