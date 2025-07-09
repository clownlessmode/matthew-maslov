import { cn } from "@shared/utils/utils";
import React, { FC, InputHTMLAttributes } from "react";

export const Input: FC<InputHTMLAttributes<HTMLInputElement>> = ({
  ...props
}) => {
  return (
    <input
      {...props}
      className={cn(
        "lg:text-2xl md:text-xl sm:text-lg text-base lg:px-[50px] md:px-[30px] px-[20px] uppercase bg-card lg:h-[70px] md:h-[60px] h-[50px] lg:rounded-3xl md:rounded-2xl rounded-xl focus:outline-none placeholder:text-muted-foreground ",
        props.className
      )}
    />
  );
};
