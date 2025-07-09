import { cn } from "@shared/utils/utils";
import React, { FC, HTMLAttributes } from "react";

export const Label: FC<HTMLAttributes<HTMLLabelElement>> = ({
  children,
  ...props
}) => {
  return (
    <label
      {...props}
      className={cn(
        "lg:text-2xl md:text-xl sm:text-lg text-base lg:ml-[50px] md:ml-[30px] ml-[20px] uppercase  ",
        props.className
      )}
    >
      {children}
    </label>
  );
};
