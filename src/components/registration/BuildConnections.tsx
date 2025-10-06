export const revalidate = 3600;

export default function BuildConnections() {
  return (
    <div className="w-full items-center gap-8 p-3 md:flex">
      <div className="pb-8 md:pb-0">
        <h1 className="text-center text-2xl font-semibold text-[#C8A36A] md:text-4xl">
          Costruisci connessioni vere
        </h1>
        <h2 className="pt-2 text-center text-white/70">
          Ispira i tuoi ospiti con le storie dietro i tuoi piatti ed entra a far
          parte di una vivace comunità di chef per far crescere la tua attività.
        </h2>
      </div>
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
  );
}
