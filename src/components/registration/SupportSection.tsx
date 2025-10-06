import { File, Globe, Phone, Shield } from "lucide-react";

export const revalidate = 3600;

export default function SupportSection() {
  return (
    <section className="w-full bg-[#232323] py-10 md:px-10 lg:px-20 xl:px-30">
      <div className="bg-[#0A0A0A] py-15 md:rounded-xl">
        <div className="mx-auto max-w-2xl pb-8 text-center md:text-left">
          <h1 className="pb-5 text-4xl">
            Siamo lì quando hai più bisgono di noi
          </h1>
          <h2 className="text-white/70">
            Non preoccuparti e affidati al nostro team, attivo 24 ore su 24, 7
            giorni su 7, per aiutarti in ogni momento.
          </h2>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-4 rounded-xl bg-[#232323] p-4">
          <div className="w-full py-3">
            <Shield color="#c8a36a" size={30} />
            <h1 className="pt-4">Pagamenti sicuri</h1>
            <h2 className="text-white/70">
              Tutti i nostri Pagamenti sono crittografati per proteggere i tuoi
              dati
            </h2>
          </div>
          <div className="w-full py-3">
            <Globe color="#c8a36a" size={30} />
            <h1 className="pt-4">Assicurazione globale</h1>
            <h2 className="text-white/70">
              Copriamo qualsiasi incidente durante l'esperienza.
            </h2>
          </div>
          <div className="w-full py-3">
            <File color="#c8a36a" size={30} />
            <h1 className="pt-4">Politica di cancellazione flessibile</h1>
            <h2 className="text-white/70">
              Flessibilità quando più ne hai bisogno.
            </h2>
          </div>
          <div className="w-full py-3">
            <Phone color="#c8a36a" size={30} />
            <h1 className="pt-4">Supporto 24 ore su 24, 7 giorni su 7</h1>
            <h2 className="text-white/70">
              Ti risponderemo in meno di 60 secondi.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
