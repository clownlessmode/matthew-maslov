"use client";
import { Button } from "@shared/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { addToCartAction } from "../actions/add-to-cart-action";

interface Props {
  productId: string;
  title: string;
  price: number;
  image: string;
  selectedSize: string;
}

export const AddToCart = ({
  productId,
  title,
  price,
  image,
  selectedSize,
}: Props) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!isAdded && !isLoading && selectedSize) {
      setIsLoading(true);
      try {
        await addToCartAction({
          productId,
          title,
          price,
          image,
          size: selectedSize,
        });
        setIsAdded(true);
      } catch (error) {
        console.error("Failed to add to cart:", error);
      } finally {
        setIsLoading(false);
      }
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

  return (
    <Button
      className={`w-full relative overflow-hidden touch-manipulation ${
        isAdded || isLoading || !selectedSize ? "pointer-events-none" : ""
      }`}
      onClick={handleAddToCart}
      disabled={isLoading || !selectedSize}
      style={{
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
      }}
    >
      <div className="relative h-6 w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isAdded ? (
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
  );
};
