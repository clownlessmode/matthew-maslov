import React, { FC } from "react";
import { useNavigation } from "../model/hooks/use-navigation";
import { cn } from "@shared/utils/utils";
import Link from "next/link";

interface DesktopNavigationProps {
  cartItemsCount: number;
}

export const DesktopNavigation: FC<DesktopNavigationProps> = ({
  cartItemsCount,
}) => {
  const { navigation, socials } = useNavigation(cartItemsCount);

  return (
    <>
      <nav className="hidden lg:block">
        <ul
          className={cn(
            "flex items-center gap-20 uppercase",
            "text-lg align-top"
          )}
        >
          {navigation.map((item) => (
            <li key={item.label}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <nav className="hidden lg:block">
        <ul
          className={cn(
            "flex items-center gap-20 uppercase",
            "text-lg align-top"
          )}
        >
          {socials.map((item) => (
            <li key={item.label}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
