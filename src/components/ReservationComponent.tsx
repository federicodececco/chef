import Image from "next/image";

interface ReservationComponentInterface {
  firstname: string;
}

export default function ReservationComponent({
  firstname,
}: ReservationComponentInterface) {
  return (
    <div className="mx-auto p-4 lg:max-w-4xl 2xl:max-w-7xl">
      <div className="text-center">
        <h1 className="py-4 text-4xl lg:hidden">
          Prenota la tua esperienza con {firstname}
        </h1>
        <h2 className="py-10 text-white/70 lg:hidden">
          Definisci i dettagli della tua richiesta e i nostri chef ti invieranno
          un menù personalizzato
        </h2>
        {/* images */}
        <div className="flex h-80 w-full justify-center gap-3">
          <div className="flex w-1/4 flex-col justify-center lg:justify-end">
            <div className="relative h-2/3 w-full">
              <Image
                src="/chef/reservation1.webp"
                fill
                className="rounded-2xl object-cover"
                alt="reservation1"
              />
            </div>
          </div>

          <div className="flex h-full w-1/4 flex-col gap-2">
            <div className="relative h-full w-full">
              <Image
                src="/chef/reservation2.webp"
                fill
                className="rounded-2xl object-cover"
                alt="reservation 2"
              />
            </div>
            <div className="relative h-full w-full">
              <Image
                src="/chef/reservation3.webp"
                fill
                className="rounded-2xl object-cover"
                alt="reservation 3"
              />
            </div>
          </div>

          <div className="flex w-1/4 flex-col justify-center lg:justify-end">
            <div className="relative h-2/3 w-full">
              <Image
                src="/chef/reservation4.webp"
                fill
                className="rounded-2xl object-cover"
                alt="reservation 4"
              />
            </div>
          </div>
        </div>
        <button className="mt-15 rounded-2xl bg-[#c8a36a] px-8 py-4 text-white hover:cursor-pointer lg:hidden">
          Prenota
        </button>
        <div className="mx-auto max-w-lg rounded-b-2xl bg-[#c8a36a]">
          <h2 className="py-4 text-4xl">
            Prenota la tua esperienza con {firstname}
          </h2>
          <h2 className="pt-4 text-white">
            Definisci i dettagli della tua richiesta e i nostri chef ti
            invieranno un menù personalizzato
          </h2>
          <button className="my-10 rounded-2xl bg-[#0A0A0A] px-8 py-4 text-lg text-[#c8a36a] duration-200 hover:cursor-pointer hover:bg-[#c8a36a] hover:text-black">
            {" "}
            Prenota
          </button>
        </div>
      </div>
    </div>
  );
}
