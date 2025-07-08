import { NotFoundTypography } from "@shared/assets/404";
import { Button } from "@shared/ui/button";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="sr-only">404</h1>
      <NotFoundTypography className="lg:w-[40vw] w-[320px] sm:w-[calc(320px*2-40px)] md:w-[calc(320px*2.5-40px)] h-fit" />
      <h1 className="text-2xl uppercase mt-5">такая страница не найдена :(</h1>
      <Link href="/" className="w-full justify-center items-center flex mt-10">
        <Button className="lg:w-[40vw] w-[320px] sm:w-[calc(320px*2-40px)] md:w-[calc(320px*2.5-40px)]">
          на главную
        </Button>
      </Link>
    </main>
  );
};

export default NotFound;
