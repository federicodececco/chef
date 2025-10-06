export const revalidate = 3600;

export default function CookYourCreations() {
  return (
    <div className="w-full items-center gap-8 p-3 md:flex md:flex-row-reverse">
      <div className="pb-8 md:pb-0">
        <h1 className="text-center text-2xl font-semibold text-[#C8A36A] md:text-4xl">
          Cucina le tue creazioni
        </h1>
        <h2 className="pt-2 text-center text-white/70">
          Metti i tuoi piatti caratteristici sotto i riflettori e libera tutte
          le tue grandi idee.
        </h2>
      </div>
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
  );
}
