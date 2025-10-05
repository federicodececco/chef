"use client";

import Image from "next/image";
import axiosIstance from "../../../lib/axios";
import imageg from "../../../../public/chef/header-image.jpg";
import { useEffect, useState } from "react";
import { Chef } from "@prisma/client";

export default function ChefPersonalPage() {
  const [chefData, setChefData] = useState<Chef | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [headerImage, setHeaderImage] = useState<string | null>();
  const [avatarImage, setAvatarImage] = useState<string | null>();

  const fetchData = async (chefId: string) => {
    setIsLoading(true);
    const res = await axiosIstance.get(`/chefs/${chefId}`);
    setChefData(res.data);
    setHeaderImage(res.data.coverUrl);
    setAvatarImage(res.data.avatarUrl);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchData("cmgdlc2dc0000iw7w7irjpprz");
  }, []);
  if (isLoading) {
    return <div>io sono un caricamento</div>;
  }
  if (!isLoading) {
    return (
      <>
        <header className="relative h-[500] w-full">
          {/* image container */}

          <div className="relative z-10 mt-18 h-full bg-cover bg-center">
            <div className="relative h-full">
              <Image
                src={headerImage || "/registration/placeholder.png"}
                alt="Header image"
                fill
                className="object-cover object-top"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j"
              />
            </div>
            <div className="absolute inset-0 -z-5 bg-black/40" />
            <div className="absolute top-[50%] left-[50%] -translate-[50%] text-center md:w-xl">
              <h1 className="text-lg font-semibold text-white md:text-3xl">
                Fare ciò che si ama
              </h1>
            </div>
          </div>
          <div className="absolute bottom-0 z-20 w-full md:px-4">
            <div className="z-20 mx-auto h-14 rounded-t-3xl bg-[#232323] lg:max-w-4xl 2xl:max-w-7xl"></div>
          </div>
        </header>
        <section></section>
      </>
    );
  }
}
