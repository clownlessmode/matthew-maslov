import { cn } from "@shared/utils/utils";

export const Hero = () => {
  return (
    <section
      className={cn(
        "flex items-end justify-start min-h-[100svh] uppercase w-full",
        "py-5 pl-5",
        "sm:p-10",
        "lg:p-15",
        "xl:p-20"
      )}
      style={{
        backgroundImage: "url(/assets/hero/hero.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1
        className={cn(
          "font-normal tracking-tighter leading-none",
          "pl-5 text-lg",
          " sm:text-4xl ",
          "md:text-[40px]",
          " lg:text-[50px]",
          " xl:text-[60px]",
          " 2xl:text-[70px]"
        )}
      >
        Ваш стиль, ваше заявление
        <br />— выберите{" "}
        <span className="text-primary font-semibold">MATTHEW MASLOV</span>
        <br />и будьте в центре внимания
      </h1>
    </section>
  );
};
