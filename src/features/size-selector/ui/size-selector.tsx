"use client";
import { IProduct } from "@entities/product";
import { Button } from "@shared/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FC, useState } from "react";

interface SizeSelectorProps
  extends Omit<
    IProduct,
    | "id"
    | "images"
    | "price"
    | "title"
    | "features"
    | "composition"
    | "shortTitle"
  > {
  onSizeChange?: (size: string) => void;
}

export const SizeSelector: FC<SizeSelectorProps> = ({
  sizes,
  onSizeChange,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || "");

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
    onSizeChange?.(size);
  };

  return (
    <div className="flex flex-row gap-2 sm:gap-4">
      {sizes.map((size) => (
        <div key={size} className="relative">
          <Button
            variant="outline"
            className="size-14 sm:size-18 sm:text-3xl relative z-10 bg-transparent border-border hover:bg-transparent"
            onClick={() => handleSizeClick(size)}
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <span
              className={`relative z-20 transition-colors duration-300 ${
                selectedSize === size
                  ? "text-primary-foreground"
                  : "text-foreground"
              }`}
            >
              {size}
            </span>
          </Button>

          <AnimatePresence>
            {selectedSize === size && (
              <motion.div
                className="absolute inset-0 bg-primary rounded-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
              />
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
