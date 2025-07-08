"use client";
import React, { FC, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu } from "@shared/assets/menu";
import { cn } from "@shared/utils/utils";
import { useNavigation } from "../model";
import Link from "next/link";

interface MobileNavigationProps {
  cartItemsCount: number;
}

export const MobileNavigation: FC<MobileNavigationProps> = ({
  cartItemsCount,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { navigation, socials } = useNavigation(cartItemsCount);
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="block lg:hidden p-2 z-[1000]"
      >
        <Menu className={cn("w-[37px] h-auto", "sm:w-[50px]")} />
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-background w-full h-screen z-[999] lg:hidden overflow-hidden"
          >
            <div className="flex flex-col items-start px-5 justify-between h-full pb-[70px]">
              <div />
              <div className="flex flex-col gap-y-[30px]">
                {navigation.map((item) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      className="text-[#DDDDDD] uppercase text-[60px] tracking-[-0.04em]"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-flow-row grid-cols-2 gap-x-[25px] gap-y-[30px]">
                {socials.map((item) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      className="text-[#DDDDDD] uppercase text-2xl"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
