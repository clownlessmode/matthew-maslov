import { Logotype } from "@shared/assets/logotype";
import { cn } from "@shared/utils/utils";
import Link from "next/link";
import { CartInfo } from "./cart-info";

export const Header = () => {
  return (
    <header
      className={cn(
        "fixed z-50 top-0 left-0 flex items-center justify-between w-full border-b border-border backdrop-blur-md",
        "py-[18px] px-5",
        "sm:px-10 ",
        " lg:px-15",
        "xl:px-20",
        "2xl:px-25"
      )}
    >
      <Link href={"/"} className="z-[1000]">
        <Logotype className={cn("w-[55px] h-auto", "sm:w-[86px]")} />
      </Link>
      <CartInfo />
    </header>
  );
};
