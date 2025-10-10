"use client";

import headerImage from "../../../public/registration/header-chef.webp";
import RegistrationPopUp from "@/components/registration/RegistrationPopUp";
import Image from "next/image";
import { useState } from "react";

export default function ChefHeader() {
  const [isPopUpOpen, setisPopUpOpen] = useState(false);

  const handleToggle = () => {
    setisPopUpOpen(!isPopUpOpen);
  };

  return (
    <>
      {isPopUpOpen && <RegistrationPopUp handleToggle={handleToggle} />}
      <header className="relative h-[500] w-full">
        <div className="relative z-10 h-full">
          <div className="relative h-full">
            <Image
              src={headerImage}
              alt="Header image"
              fill
              className="object-cover object-top"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j"
            />
          </div>
          <div className="absolute inset-0 z-0 bg-black/40" />
          <div className="absolute top-[50%] left-[50%] -translate-[50%] text-center md:w-xl">
            <h1 className="text-lg font-semibold text-white md:text-3xl">
              Fà ciò che ami
            </h1>
            <button
              className="bg-gold hover:text-first-theme z-20 mt-8 rounded-4xl px-6 py-3 text-sm font-semibold duration-200 hover:bg-[#F4C858] md:px-8 md:py-3"
              onClick={handleToggle}
            >
              Diventa uno dei nostri chef
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 z-20 w-full md:px-4">
          <div className="z-20 mx-auto h-14 rounded-t-3xl bg-[#232323] lg:max-w-4xl 2xl:max-w-7xl"></div>
        </div>
      </header>
    </>
  );
}
