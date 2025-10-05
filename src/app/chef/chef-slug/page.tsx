"use client";

import Image from "next/image";
import axiosIstance from "../../../lib/axios";
import imageg from "../../../../public/chef/header-image.jpg";
import { useEffect, useState } from "react";
import { Chef } from "@prisma/client";
import HeaderComponent from "@/components/HeaderComponent";
import HeroPersonalComponent from "@/components/HeroPersonalComponent";

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
          mainText={`Chef ${chefData.user.firstname} ${chefData.user.lastname}`}
          subText={`Chef Privato dall'italia`}
          imageUrl={chefData.coverUrl}
        ></HeaderComponent>
        <section className="bg-[#0A0A0A] md:px-4">
          <HeroPersonalComponent imageUrl={chefData?.avatarUrl} />
        </section>
        <section></section>
      </>
    );
  }
}
