import { Logotype } from "@shared/assets/logotype";
import { cn } from "@shared/utils/utils";
import React from "react";
import { useNavigation } from "../model";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Typography } from "@shared/assets/typography";

export const Footer = () => {
  const { navigation, socials } = useNavigation();
  return (
    <footer
      className={cn(
        "border-t border-border w-full pb-0! flex flex-col gap-[50px] bg-background z-[999999999] relative",
        "p-5",
        "sm:p-10 ",
        "lg:p-15",
        "xl:p-20",
        "2xl:p-25"
      )}
    >
      <nav
        className={cn(
          "flex flex-col lg:flex-row lg:gap-[180px] items-start",
          "gap-[50px] w-full"
        )}
      >
        <Logotype className={cn("w-[55px] h-auto", "sm:w-[86px]")} />
        <div className="flex flex-row  justify-between uppercase text-sm tracking-tighter sm:text-lg max-w-[420px] w-full  items-start">
          <ul className="flex flex-col gap-2">
            {navigation.map((item) => (
              <li key={item.label}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-2">
            {socials.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn("flex flex-row items-center gap-2")}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <Typography className="w-full h-auto" />
    </footer>
  );
};
