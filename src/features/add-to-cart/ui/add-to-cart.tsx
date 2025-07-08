"use client";
import { Button } from "@shared/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, FC } from "react";
import { useRouter } from "next/navigation";
import { CartAPI } from "@shared/lib";

interface AddToCartProps {
  productId: string;
  selectedSize: string;
  quantity?: number;
  disabled?: boolean;
}

export const AddToCart: FC<AddToCartProps> = ({
  productId,
  selectedSize,
  quantity = 1,
  disabled = false,
}) => {
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async () => {
    if (isAdded || isLoading || disabled) return;

    if (!selectedSize) {
      setError("Выберите размер");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await CartAPI.addToCart({
        productId,
        size: selectedSize as "S" | "M" | "L" | "XL" | "XXL",
        quantity,
      });

      setIsAdded(true);

      // Refresh SSR data to update cart count in header (without full page reload)
      router.refresh();
    } catch (err) {
      console.error("Failed to add to cart:", err);
      setError("Не удалось добавить в корзину");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdded) {
      const timer = setTimeout(() => {
        setIsAdded(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAdded]);

  // Clear error when size changes
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [selectedSize]);

  return (
    <div className="w-full space-y-2">
      <Button
        className={`w-full relative overflow-hidden touch-manipulation ${
          isAdded || isLoading ? "pointer-events-none" : ""
        }`}
        onClick={handleAddToCart}
        disabled={disabled || isLoading || !selectedSize}
        style={{
          WebkitTapHighlightColor: "transparent",
          touchAction: "manipulation",
        }}
      >
        <div className="relative h-6 w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.span
                key="loading"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute"
              >
                Добавляем...
              </motion.span>
            ) : !isAdded ? (
              <motion.span
                key="add-to-cart"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute"
              >
                Добавить в корзину
              </motion.span>
            ) : (
              <motion.span
                key="added-to-cart"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute"
              >
                Добавлено в корзину
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </Button>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {!selectedSize && (
        <p className="text-sm text-muted-foreground text-center">
          Выберите размер
        </p>
      )}
    </div>
  );
};
