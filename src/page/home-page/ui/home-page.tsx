import { Hero } from "@widgets/hero";

import { cn } from "@shared/utils/utils";
import { ProductsList } from "@widgets/products-list";

const HomePage = () => {
  return (
    <main
      className={cn(
        "bg-background flex flex-col items-center justify-center",
        "gap-[80px]"
      )}
    >
      <Hero />
      <ProductsList />
    </main>
  );
};
export default HomePage;
