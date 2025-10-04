"use client";
import ChefCarousel from "@/components/ChefCarousel";
import CitySlider from "@/components/CitySlider";
import {
  CalendarDays,
  MessagesSquare,
  ReceiptText,
  SlidersVertical,
} from "lucide-react";

export default function ChefRegistration() {
  return (
    <>
      <div className="-z-4 bg-[#232323] md:bg-[#0A0A0A]">
        <header className="relative h-[500] w-full">
          {/* image container */}

          <div className="relative z-10 mt-18 h-full bg-[url('/registration/header-chef-mobile.webp')] bg-cover md:bg-[url('/registration/header-chef.webp')]">
            <div className="absolute inset-0 -z-5 bg-black/40" />
            <div className="absolute top-[50%] left-[50%] -translate-[50%] text-center md:w-xl">
              <h1 className="text-lg font-semibold text-white md:text-3xl">
                Fare ciò che si ama
              </h1>
              <button className="z-20 mt-8 rounded-4xl bg-[#F4C858] px-6 py-3 text-sm font-semibold md:px-8 md:py-3">
                Diventa uno dei nostri chef
              </button>
            </div>
          </div>
          <div className="absolute bottom-0 z-20 w-full md:px-4">
            <div className="z-20 mx-auto h-14 rounded-t-3xl bg-[#232323] lg:max-w-4xl 2xl:max-w-7xl"></div>
          </div>
        </header>

        {/* description section */}
        <section className="w-full pb-40 md:px-4">
          <div className="mx-auto rounded-b-3xl bg-[#232323] lg:max-w-4xl 2xl:max-w-7xl">
            {/* first container */}
            <div className="w-full items-center gap-8 p-3 md:flex">
              <div className="pb-8 md:pb-0">
                <h1 className="text-center text-2xl font-semibold text-[#C8A36A] md:text-4xl">
                  Sii il capo di te stesso
                </h1>
                <h2 className="pt-2 text-center text-white/70">
                  Prendi il controllo del tuo tempo e del tuo futuro. È tempo di
                  liberarsi dai confini delle mura del ristorante e dare forma
                  alla tua storia.
                </h2>
              </div>
              {/* images container */}
              <div className="flex items-center justify-center">
                <div className="h-[230px] w-[170px] px-2 md:h-[215px] md:w-[152px]">
                  <div className="h-full w-full rounded-2xl bg-[url('/registration/man-in-nature.webp')] bg-cover"></div>
                </div>
                <div>
                  <div className="h-[160px] w-[170px] pb-1 md:h-[153px] md:w-[150px]">
                    <div className="h-full w-full rounded-2xl bg-[url('/registration/woman-chef.webp')] bg-cover"></div>
                  </div>
                  <div className="h-[160px] w-[170px] pt-1 md:h-[153px] md:w-[150px]">
                    <div className="h-full w-full rounded-2xl bg-[url('/registration/fish-market.webp')] bg-cover"></div>
                  </div>
                </div>
                <div className="h-[230px] w-[170px] px-2 md:h-[215px] md:w-[152px]">
                  <div className="h-full w-full rounded-2xl bg-[url('/registration/woman-with-spoon.webp')] bg-cover"></div>
                </div>
              </div>
            </div>
            {/* second container */}
            <div className="pt-20">
              <div className="w-full items-center gap-8 p-3 md:flex md:flex-row-reverse">
                <div className="pb-8 md:pb-0">
                  <h1 className="text-center text-2xl font-semibold text-[#C8A36A] md:text-4xl">
                    Cucina le tue creazioni
                  </h1>
                  <h2 className="pt-2 text-center text-white/70">
                    Metti i tuoi piatti caratteristici sotto i riflettori e
                    libera tutte le tue grandi idee.
                  </h2>
                </div>
                {/* images container */}
                <div className="flex items-center justify-center">
                  <div className="pt-9">
                    <div className="h-40 w-32 p-1 sm:h-46 sm:w-38 md:h-50 md:w-46 lg:h-56 lg:w-52">
                      <div className="h-full w-full rounded-2xl bg-[url('/registration/potato-with-somethin.webp')] bg-cover"></div>
                    </div>
                    <div className="h-40 w-32 p-1 sm:h-46 sm:w-38 md:h-50 md:w-46 lg:h-56 lg:w-52">
                      <div className="h-full w-full rounded-2xl bg-[url('/registration/man-in-nature-with-food.webp')] bg-cover"></div>
                    </div>
                  </div>
                  <div className="pb-9">
                    <div className="h-40 w-32 p-1 sm:h-46 sm:w-38 md:h-50 md:w-46 lg:h-56 lg:w-52">
                      <div className="h-full w-full rounded-2xl bg-[url('/registration/woman-with-cream.webp')] bg-cover"></div>
                    </div>
                    <div className="h-40 w-32 p-1 sm:h-46 sm:w-38 md:h-50 md:w-46 lg:h-56 lg:w-52">
                      <div className="h-full w-full rounded-2xl bg-[url('/registration/strange-dessert.webp')] bg-cover"></div>
                    </div>
                  </div>
                  <div className="pt-9">
                    <div className="h-40 w-32 p-1 sm:h-46 sm:w-38 md:h-50 md:w-46 lg:h-56 lg:w-52">
                      <div className="h-full w-full rounded-2xl bg-[url('/registration/smoking-whaterver-that-is.webp')] bg-cover"></div>
                    </div>
                    <div className="h-40 w-32 p-1 sm:h-46 sm:w-38 md:h-50 md:w-46 lg:h-56 lg:w-52">
                      <div className="h-full w-full rounded-2xl bg-[url('/registration/rice-yellow.webp')] bg-cover"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* third container */}
            <div className="relative -bottom-15 pt-20">
              <div className="w-full items-center gap-8 p-3 md:flex">
                <div className="pb-8 md:pb-0">
                  <h1 className="text-center text-2xl font-semibold text-[#C8A36A] md:text-4xl">
                    Costruisci connessioni vere
                  </h1>
                  <h2 className="pt-2 text-center text-white/70">
                    Ispira i tuoi ospiti con le storie dietro i tuoi piatti ed
                    entra a far parte di una vivace comunità di chef per far
                    crescere la tua attività.
                  </h2>
                </div>
                {/* images container */}
                <div className="flex items-center justify-center">
                  <div className="p-1">
                    <div className="h-40 w-32 p-1 pb-2 sm:w-38 md:h-50 md:w-40 lg:h-56 lg:w-46">
                      <div className="h-full w-full rounded-2xl bg-[url('/registration/people-in-kitchen.webp')] bg-cover"></div>
                    </div>
                    <div className="h-44 w-32 pt-2 sm:w-38 md:h-58 md:w-40 lg:h-64 lg:w-46">
                      <div className="h-full w-full rounded-2xl bg-[url('/registration/man-chef-explaining.webp')] bg-cover"></div>
                    </div>
                  </div>
                  <div className="p-1 pt-10">
                    <div className="h-48 w-32 p-1 sm:w-38 md:h-64 md:w-40 lg:h-68 lg:w-46">
                      <div className="h-full w-full rounded-2xl bg-[url('/registration/table-of-people.webp')] bg-cover"></div>
                    </div>
                  </div>
                  <div className="p-1 pb-10">
                    <div className="h-52 w-32 p-1 sm:w-38 md:h-64 md:w-40 lg:h-68 lg:w-46">
                      <div className="h-full w-full rounded-2xl bg-[url('/registration/two-man-coocking.webp')] bg-cover"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* second chapter section */}
        <section className="h-[620px] w-full">
          <div className="relative z-10 mt-18 h-full bg-[url('/registration/chef-man-footer-mobile.webp')] bg-cover md:bg-[url('/registration/chef-man-footer.webp')]">
            <div className="absolute inset-0 -z-5 bg-black/40" />
            <div className="absolute top-[50%] left-[50%] -translate-[50%] text-center md:w-xl">
              <h1 className="text-lg font-semibold text-white md:text-3xl">
                Leader Globali dal 2012
              </h1>
              <button className="z-20 mt-8 rounded-4xl bg-white px-6 py-3 text-sm font-semibold md:px-8 md:py-3">
                Unisciti a noi ora
              </button>
            </div>
          </div>
        </section>

        <div className="hidden w-full py-10 lg:block">
          <CitySlider></CitySlider>
        </div>

        {/* take controll section */}
        <section className="w-full bg-[#0A0A0A] pb-20">
          <div className="pt-20 text-center">
            <h1 className="text-5xl font-semibold text-[#C8A36A]">
              Prendi il controllo
            </h1>
            <h2 className="pt-12 text-white/70">
              Il tuo talento, le tue regole.
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-10 pt-10">
            <div className="w-80 rounded-2xl bg-white py-8 pr-20 pl-5 shadow-2xl xl:pr-10">
              <div className="py-3">
                <SlidersVertical size={35} color="gold" />
              </div>
              <h1 className="text-lg font-bold">Cucina i tuoi menu</h1>
              <h2>Lascia che la tua creatività brilli.</h2>
            </div>
            <div className="w-80 rounded-2xl bg-white py-8 pr-20 pl-5 shadow-2xl xl:pr-10">
              <div className="py-3">
                <CalendarDays size={35} color="gold" />
              </div>
              <h1 className="text-lg font-bold">Decidi i tuoi orari</h1>
              <h2>Lavori solo il martedì? Perfetto.</h2>
            </div>
            <div className="w-80 rounded-2xl bg-white py-8 pr-20 pl-5 shadow-2xl xl:pr-10">
              <div className="py-3">
                <MessagesSquare size={35} color="gold" />
              </div>
              <h1 className="text-lg font-bold">Parla con i tuoi ospiti.</h1>
              <h2>Crea un contatto personale con i tuoi ospiti.</h2>
            </div>
            <div className="w-80 rounded-2xl bg-white py-8 pr-20 pl-5 shadow-2xl xl:pr-10">
              <div className="py-3">
                <ReceiptText size={35} color="gold" />
              </div>
              <h1 className="text-lg font-bold">Imposta i tuoi prezzi</h1>
              <h2>Gestisci la tua attività e definisci i tuoi margini.</h2>
            </div>
          </div>
        </section>

        {/* chefs section */}
        <section className="mx-auto w-full px-3 md:flex md:items-center md:gap-8">
          <div className="order-1 pt-10 pb-4 text-left md:w-1/3 md:flex-shrink-0 md:pl-20 lg:pl-25 xl:pl-40 2xl:pl-45">
            <h1 className="text-4xl">Hanno già fatto il passo</h1>
            <div className="hidden py-8 md:block">
              <h2 className="pb-8 text-white/70">
                Unisciti a noi e iniza a ricevere richieste dai tuoi futuri
                ospiti
              </h2>
              <button className="rounded-lg bg-[#C8A36A] px-6 py-3 text-lg text-white">
                Iscriviti
              </button>
            </div>
          </div>
          <div className="order-3 min-w-0 flex-1">
            <ChefCarousel></ChefCarousel>
          </div>
          <div className="flex justify-center pt-10 md:hidden">
            <button className="rounded-lg bg-[#C8A36A] px-6 py-3 text-lg text-white">
              Iscriviti
            </button>
          </div>
        </section>

        {/* other informations section */}
        <section className="w-full bg-[#232323] py-20 md:px-20">
          <div className="bg-[#0A0A0A]"></div>
        </section>
      </div>
    </>
  );
}
