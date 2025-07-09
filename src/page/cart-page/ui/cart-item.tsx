"use client";
import { CartItem as CartItemType } from "@shared/types/cart";
import { formatPrice } from "@shared/utils/utils";
import { useCartStore } from "@shared/stores/cart.store";
import Image from "next/image";
import React from "react";
import { Minus, Plus } from "lucide-react";

interface Props {
  item: CartItemType;
}

// Компонент кнопки для изменения количества
const QuantityButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  const baseClasses =
    "flex items-center justify-center size-5 text-sm font-semibold transition-colors border rounded-full bg-primary text-primary-foreground hover:bg-primary/90";

  return (
    <button type="button" onClick={onClick} className={baseClasses}>
      {children}
    </button>
  );
};

export const CartItem = ({ item }: Props) => {
  const { increaseQuantity, decreaseQuantity } = useCartStore();

  const imageUrl =
    item.images && item.images.length > 0
      ? item.images[0]
      : "/assets/products/jacket/1.webp";

  return (
    <div className="flex gap-4 md:p-8 p-6 rounded-3xl bg-card flex-col">
      <div className="flex flex-row gap-5 items-center">
        <Image
          src={imageUrl}
          alt={item.title || "Product image"}
          width={100}
          height={100}
          className="md:size-20 sm:size-15 size-16 object-cover rounded-xl flex-shrink-0"
        />
        <div className="flex flex-col">
          <h3 className="md:text-xl sm:text-lg text-base uppercase">
            {item.shortTitle}
          </h3>
          <h4 className="sm:text-3xl text-xl md:text-4xl 2xl:text-5xl font-semibold uppercase">
            {item.title.replace(item.shortTitle, "")}
          </h4>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center">
        <p className="uppercase sm:text-3xl text-xl">
          Size: {item.selectedSize}
        </p>
        <div className="flex flex-row ">
          <div className="flex flex-row items-center gap-2">
            <QuantityButton onClick={() => decreaseQuantity(item.id)}>
              <Minus className="size-3" strokeWidth={3} />
            </QuantityButton>
            <p className="sm:text-3xl text-xl tabular-nums text-center md:w-[3rem] w-[2rem]">
              {item.quantity}X
            </p>
            <QuantityButton onClick={() => increaseQuantity(item.id)}>
              <Plus className="size-3" strokeWidth={3} />
            </QuantityButton>
          </div>
          <p className="sm:text-3xl text-xl  tabular-nums md:w-[12rem] sm:w-[10rem] w-[6rem] text-right">
            {formatPrice((item.price || 0) * (item.quantity || 1))} ₽
          </p>
        </div>
      </div>
    </div>
  );
};

//       <div className="flex-1 flex flex-col justify-between">
//         <div>
//           <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
//             {item.shortTitle || item.title || "Товар"}
//           </h3>
//           <p className="text-muted-foreground text-xs sm:text-sm">
//             Размер: {item.selectedSize}
//           </p>
//         </div>

//         <div className="flex items-center justify-between mt-2">
//           <div className="flex items-center gap-3">
//             <span className="text-xs sm:text-sm text-muted-foreground">
//               Кол-во:
//             </span>
//             <div className="flex items-center gap-2">
//               <QuantityButton
//                 action={decreaseQuantityAction}
//                 itemId={item.id}
//                 variant="decrease"
//               >
//                 −
//               </QuantityButton>

//               <span className="font-medium min-w-[2rem] text-center">
//                 {item.quantity || 1}
//               </span>

//               <QuantityButton action={increaseQuantityAction} itemId={item.id}>
//                 +
//               </QuantityButton>
//             </div>
//           </div>

//           <div className="text-right flex items-center gap-3">
//             <div>
//               <p className="font-semibold text-sm sm:text-base">
//                 {formatPrice((item.price || 0) * (item.quantity || 1))} ₽
//               </p>
//               {(item.quantity || 1) > 1 && (
//                 <p className="text-xs text-muted-foreground">
//                   {formatPrice(item.price || 0)} ₽ за шт.
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
