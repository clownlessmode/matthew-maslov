import { cn } from "@shared/utils/utils";
import HorizontalCards from "./horizontal-cards";
import VerticalParallax from "./vertical-parallax";
import HorizontalParallax from "./horizontal-parallax";

const LookbookPage = () => {
  return (
    <main className={cn("flex flex-col relative items-center justify-center ")}>
      <HorizontalCards />
      <VerticalParallax />
      <HorizontalParallax />
    </main>
  );
};

export default LookbookPage;
