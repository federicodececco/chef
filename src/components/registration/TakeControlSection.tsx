import {
  CalendarDays,
  MessagesSquare,
  ReceiptText,
  SlidersVertical,
} from "lucide-react";

export const revalidate = 3600;

export default function TakeControlSection() {
  return (
    <section className="w-full bg-[#0A0A0A] pb-20">
      <div className="pt-20 text-center">
        <h1 className="text-5xl font-semibold text-[#C8A36A]">
          Prendi il controllo
        </h1>
        <h2 className="pt-12 text-white/70">Il tuo talento, le tue regole.</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-10 pt-10">
        <div className="bg-second-theme w-80 rounded-2xl py-8 pr-20 pl-5 shadow-2xl xl:pr-10">
          <div className="py-3">
            <SlidersVertical size={35} color="gold" />
          </div>
          <h1 className="text-lg font-bold">Cucina i tuoi menu</h1>
          <h2>Lascia che la tua creatività brilli.</h2>
        </div>
        <div className="bg-second-theme w-80 rounded-2xl py-8 pr-20 pl-5 shadow-2xl xl:pr-10">
          <div className="py-3">
            <CalendarDays size={35} color="gold" />
          </div>
          <h1 className="text-lg font-bold">Decidi i tuoi orari</h1>
          <h2>Lavori solo il martedì? Perfetto.</h2>
        </div>
        <div className="bg-second-theme w-80 rounded-2xl py-8 pr-20 pl-5 shadow-2xl xl:pr-10">
          <div className="py-3">
            <MessagesSquare size={35} color="gold" />
          </div>
          <h1 className="text-lg font-bold">Parla con i tuoi ospiti.</h1>
          <h2>Crea un contatto personale con i tuoi ospiti.</h2>
        </div>
        <div className="bg-second-theme w-80 rounded-2xl py-8 pr-20 pl-5 shadow-2xl xl:pr-10">
          <div className="py-3">
            <ReceiptText size={35} color="gold" />
          </div>
          <h1 className="text-lg font-bold">Imposta i tuoi prezzi</h1>
          <h2>Gestisci la tua attività e definisci i tuoi margini.</h2>
        </div>
      </div>
    </section>
  );
}
