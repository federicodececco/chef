"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { MessageSquare } from "lucide-react";
import axiosIstance from "../../../lib/axios";
import HeaderComponent from "@/components/personalPage/HeaderComponent";
import HeroPersonalComponent from "@/components/personalPage/HeroPersonalComponent";
import MenuCarouselComponent from "@/components/personalPage/MenuCarouselComponent";
import GalleryComponent from "@/components/personalPage/GalleryComponent";
import ChefReviewComponent from "@/components/personalPage/ChefReviewsComponent";
import ReservationComponent from "@/components/personalPage/ReservationComponent";
import ChatComponent from "@/components/personalPage/ChatComponent";
import { ChefComplete } from "@/util/types";
import { useAuth } from "@/context/AuthContext";
import Custom404 from "@/components/codes/Custom404";

export default function ChefPersonalPage() {
  const { chefSlugId } = useParams<{ chefSlugId: string }>();
  const {
    user,
    isAuthenticated,
    isChef: currentUserIsChef,
    isLoading: authLoading,
  } = useAuth();
  const router = useRouter();

  const [chefData, setChefData] = useState<ChefComplete | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(true);

  const handleChatClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setShowChat(true);
  };

  useEffect(() => {
    if (!chefSlugId) return;

    const [idPart, ...slugParts] = chefSlugId.split("-");
    const chefId = idPart;
    const slug = slugParts.join("-");

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axiosIstance.get(`/chefs/${chefId}`);
        const data = res.data;

        setChefData(data);
        console.log(data);
        /* Verifica se il profilo è completo */
        if (!data.coverUrl || !data.avatarUrl) {
          setIsProfileComplete(false);
        }

        /* Reindirizza se lo slug non corrisponde */
        if (data.slug && data.slug !== slug) {
          router.replace(`/chef/${chefId}-${data.slug}`);
        }
      } catch (err) {
        console.error("Errore nel caricamento dello chef:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [chefSlugId, router]);

  /* Loading state */
  if (isLoading || authLoading) {
    return (
      <div className="bg-first-theme flex h-screen justify-center">
        <span className="loading loading-bars loading-xl text-gold"></span>
      </div>
    );
  }

  /* Error state - Chef non trovato */
  if (!chefData) {
    return <Custom404 />;
  }
  /* 
   Profilo incompleto */
  if (!isProfileComplete) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-[#c8a36a]">
            Profilo in costruzione
          </h1>
          <p className="text-white/70">
            Lo chef sta completando il suo profilo. Torna presto!
          </p>
        </div>
      </div>
    );
  }

  const shouldShowChatButton =
    isAuthenticated && user && user.id !== chefData.id && !currentUserIsChef;

  const menusWithDishes = (chefData.Menus || []).map((menu) => ({
    ...menu,
    Dishes: menu.Dishes || [],
  }));

  return (
    <>
      <HeaderComponent
        mainText={`Chef ${chefData.user?.firstname} ${chefData.user?.lastname}`}
        subText={`Chef Privato da ${chefData.city}`}
        imageUrl={chefData.coverUrl}
      />

      <section className="bg-[#232323] pb-10 md:bg-[#0A0A0A] md:px-4">
        <HeroPersonalComponent
          imageUrl={chefData.avatarUrl}
          description={chefData.bio}
          facts={chefData.Facts || null}
          briefDescription={chefData.bioBrief || null}
        />
      </section>

      <section className="bg-[#232323] py-4 pb-10 md:px-4">
        <h1 className="py-6 text-center text-4xl font-bold text-white">
          I miei menu
        </h1>
        <MenuCarouselComponent menus={menusWithDishes || []} />
      </section>

      <section className="bg-[#232323] md:px-4">
        <div className="px-4 md:px-0">
          <GalleryComponent photos={chefData.Photos || []} />
        </div>
      </section>

      <section className="bg-[#232323] py-6 md:px-4">
        {chefData.Review.length > 0 && (
          <ChefReviewComponent
            reviews={chefData.Review || []}
            firstname={chefData.user?.firstname || ""}
          />
        )}
      </section>

      <section className="rounded-t-2xl bg-[#0A0A0A] py-6 md:px-4 lg:bg-[#232323]">
        <ReservationComponent firstname={chefData.user?.firstname || ""} />
      </section>

      {/*solo per utenti autenticati non-chef */}
      {shouldShowChatButton && (
        <>
          <button
            onClick={handleChatClick}
            className="fixed right-6 bottom-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#c8a36a] text-[#0a0a0a] shadow-lg transition hover:bg-[#d4b480] hover:shadow-xl"
            aria-label="Apri chat"
          >
            <MessageSquare size={28} />
          </button>

          {showChat && (
            <ChatComponent
              currentUserId={user!.id}
              isChef={false}
              targetChefId={chefData.id}
              onClose={() => setShowChat(false)}
            />
          )}
        </>
      )}
    </>
  );
}
