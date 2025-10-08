import { ChefHat, Home, ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Custom404() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-[#c8a36a]/5 blur-3xl"></div>
        <div className="absolute right-10 bottom-20 h-96 w-96 rounded-full bg-[#c8a36a]/5 blur-3xl"></div>
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-[#232323] p-8">
              <ChefHat size={80} className="text-[#c8a36a]" />
            </div>
          </div>

          <h1 className="mb-4 text-9xl font-bold text-[#c8a36a]">404</h1>

          <h2 className="mb-3 text-3xl font-bold">Pagina non trovata</h2>
          <p className="mb-8 max-w-md text-lg text-white/70">
            Ops! Sembra che questa ricetta non sia nel nostro menu. La pagina
            che stai cercando non esiste o è stata spostata.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 font-semibold transition hover:bg-white/20"
            >
              <ArrowLeft size={20} />
              Torna indietro
            </button>

            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 rounded-lg bg-[#c8a36a] px-6 py-3 font-semibold text-[#0a0a0a] transition hover:bg-[#d4b480]"
            >
              <Home size={20} />
              Vai alla Home
            </button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm">
            <button
              onClick={() => router.push("/chef")}
              className="flex items-center gap-2 text-[#c8a36a] transition hover:text-[#d4b480]"
            >
              <Search size={16} />
              Cerca Chef
            </button>
            <span className="text-white/30">•</span>
            <button
              onClick={() => router.push("/login")}
              className="text-white/70 transition hover:text-white"
            >
              Accedi
            </button>
            <span className="text-white/30">•</span>
            <button
              onClick={() => router.push("/chef/chef-registration")}
              className="text-white/70 transition hover:text-white"
            >
              Diventa Chef
            </button>
          </div>
        </div>

        <div className="absolute right-0 bottom-8 left-0 text-center">
          <p className="text-sm text-white/30">
            Errore 404 - Pagina non trovata
          </p>
        </div>
      </div>
    </div>
  );
}
