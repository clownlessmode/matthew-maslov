import { Logotype } from "@shared/assets/logotype";
import { Menu } from "@shared/assets/menu";
import { cn } from "@shared/utils/utils";
import Link from "next/link";
import { useNavigation } from "../model/hooks/use-navigation";

export const Header = () => {
  const { navigation, socials } = useNavigation();
  return (
    <header
      className={cn(
        "fixed top-0 left-0 flex items-center justify-between w-full border-b border-border backdrop-blur-xl",
        "py-[18px] px-5",
        "sm:px-10 ",
        " lg:px-15",
        "xl:px-20",
        "2xl:px-25"
      )}
    >
      <Link href={"/"}>
        <Logotype className={cn("w-[55px] h-auto", "sm:w-[86px]")} />
      </Link>
      {/* Мобильное меню */}
      <Menu className={cn("w-[37px] h-auto", "sm:w-[50px] block lg:hidden")} />
      {/* Десктопное меню */}
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
    </header>
  );
};
