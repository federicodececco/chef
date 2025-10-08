"use client";

import { ReactNode } from "react";
import ChefCarousel from "../ChefCarousel";

export default function ChefsShowcaseSection() {
  return (
    <section className="mx-auto max-w-7xl px-3 pb-10 md:flex md:items-center md:gap-8">
      <div className="order-1 pt-10 pb-4 text-left md:w-1/3 md:flex-shrink-0">
        <h1 className="text-4xl">Hanno già fatto il passo</h1>
        <div className="hidden py-8 md:block">
          <h2 className="pb-8 text-white/70">
            Unisciti a noi e iniza a ricevere richieste dai tuoi futuri ospiti
          </h2>
          <button className="rounded-lg bg-[#C8A36A] px-6 py-3 text-lg text-white">
            Iscriviti
          </button>
        </div>
      </div>
      <div className="order-3 min-w-0 flex-grow">
        <ChefCarousel />
      </div>
      <div className="flex justify-center pt-10 md:hidden">
        <button className="rounded-lg bg-[#C8A36A] px-6 py-3 text-lg text-white">
          Iscriviti
        </button>
      </div>
    </section>
  );
}
