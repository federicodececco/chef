"use client";

import Image from "next/image";
import axiosIstance from "../../../lib/axios";
import imageg from "../../../../public/chef/header-image.jpg";
import { useEffect, useState } from "react";
import { Chef } from "@prisma/client";
import HeaderComponent from "@/components/HeaderComponent";
import HeroPersonalComponent from "@/components/HeroPersonalComponent";
import MenuCarouselComponent from "@/components/MenuCarouselComponent";
import GalleryComponent from "@/components/GalleryComponent";
import ChefReviewComponent from "@/components/ChefReviewsComponent";
import ReservationComponent from "@/components/ReservationComponent";

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
    console.log(res.data);
    console.log(res.data.Menus);
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
        <HeaderComponent
          mainText={`Chef ${chefData?.user?.firstname} ${chefData?.user?.lastname}`}
          subText={`Chef Privato dall'italia`}
          imageUrl={chefData?.coverUrl}
        ></HeaderComponent>
        <section className="bg-[#232323] pb-10 md:bg-[#0A0A0A] md:px-4">
          <HeroPersonalComponent
            imageUrl={chefData?.avatarUrl}
            description={chefData?.bio}
            facts={chefData?.Facts}
            briefDescription={chefData?.bioBrief}
          />
        </section>
        <section className="bg-[#232323] py-4 pb-10 md:px-4">
          <h1 className="py-6 text-center text-4xl">I miei menu</h1>
          <MenuCarouselComponent menus={chefData?.Menus} />
        </section>
        <section className="bg-[#232323] md:px-4">
          <div className="px-4 md:px-0">
            <GalleryComponent photos={chefData?.Photos} />
          </div>
        </section>
        <section className="bg-[#232323] py-6 md:px-4">
          <ChefReviewComponent
            reviews={chefData?.Review}
            firstname={chefData?.user?.firstname}
          />
        </section>
        <section className="rounded-2xl bg-[#0A0A0A] py-6 md:px-4 lg:bg-[#232323]">
          <ReservationComponent firstname={chefData?.user?.firstname} />
        </section>
      </>
    );
  }
}
