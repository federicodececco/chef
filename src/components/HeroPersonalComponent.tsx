import { Facts } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

interface HeroPersonalComponentInterface {
  imageUrl: any | string;
  briefDescription: any | string;
  description: any | string;
  facts: Facts[];
}

export default function HeroPersonalComponent({
  imageUrl,
  briefDescription,
  description,
  facts,
}: HeroPersonalComponentInterface) {
  const [extended, setIsExtended] = useState(false);

  return (
    <div className="mx-auto bg-[#232323] md:rounded-b-2xl lg:max-w-4xl 2xl:max-w-7xl">
      {/* first section */}
      <div className="grid grid-cols-1 gap-4 p-5 px-10 md:grid-cols-3">
        {/* first column */}
        <div className="col-span-1 text-center md:text-left">
          <h1 className="text-5xl">Conoscimi meglio</h1>
          <h2 className="pt-8 text-2xl text-white/70 italic">
            {briefDescription}
          </h2>
          <button className="mt-10 mb-5 rounded-xl bg-[#c8a36a] px-8 py-3">
            Prenota
          </button>
        </div>
        {/* second column */}
        <div>
          <div
            className={`col-span-1 text-white/70 ${extended ? "" : "max-h-60 overflow-clip"}`}
          >
            <h2 className="text-lg">{description}</h2>
          </div>
          <button
            className="border-b-1 border-transparent pt-4 font-bold text-white/70 italic transition-all duration-300 hover:cursor-pointer hover:border-white/70"
            onClick={() => setIsExtended(!extended)}
          >
            {extended ? "Leggi meno" : "Scopri di più"}
          </button>
        </div>
        {/* third column */}
        <div className="col-span-1 max-w-full">
          <div className="relative aspect-square">
            <Image
              src={imageUrl}
              alt="chef image"
              fill
              className="rounded-2xl object-cover"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j"
            />
          </div>
        </div>
      </div>
      {/*br line */}
      <div className="hidden w-full p-5 md:block">
        <div className="w-full border-b-1 text-black"> </div>
      </div>
      {/* second section */}
      <div className="p-5 px-10">
        <h1 className="font py-3 text-3xl">Di più su di me</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <h1 className="font-semibold">{facts[0].short}</h1>
            <h2 className="py-4 text-white/70">{facts[0].long}</h2>
          </div>
          <div>
            <h1 className="font-semibold">{facts[1].short}</h1>
            <h2 className="py-4 text-white/70">{facts[0].long}</h2>
          </div>
          <div>
            <h1 className="font-semibold">{facts[2].short}</h1>
            <h2 className="py-4 text-white/70">{facts[0].long}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
