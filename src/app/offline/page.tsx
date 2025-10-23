"use client";

export default function OfflinePage() {
  console.log("offline");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="text-6xl">🍳</div>

        <h1 className="text-3xl font-bold text-white">Sei Offline</h1>

        <p className="text-lg text-white/70">
          Non riesco a connettermi al server. Controlla la tua connessione
          internet e riprova.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-[#C8A36A] px-8 py-3 text-lg font-medium text-white transition-all hover:bg-[#B8935A]"
        >
          Riprova
        </button>
      </div>
    </div>
  );
}
