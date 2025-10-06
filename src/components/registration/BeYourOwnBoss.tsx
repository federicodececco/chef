export const revalidate = 3600;

export default function BeYourOwnBoss() {
  return (
    <div className="w-full items-center gap-8 p-3 md:flex">
      <div className="pb-8 md:pb-0">
        <h1 className="text-center text-2xl font-semibold text-[#C8A36A] md:text-4xl">
          Sii il capo di te stesso
        </h1>
        <h2 className="pt-2 text-center text-white/70">
          Prendi il controllo del tuo tempo e del tuo futuro. È tempo di
          liberarsi dai confini delle mura del ristorante e dare forma alla tua
          storia.
        </h2>
      </div>
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
  );
}
