"use client";

import { useState } from "react";
import { ChefHat, Mail, Lock, AlertCircle, House } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Errore durante il login");
        setIsLoading(false);
        return;
      }

      if (data.user.isChef) {
        window.location.href = "/chef/chef-registration";
      } else {
        window.location.href = "/chef/chef-registration";
      }
    } catch (err) {
      console.error(err);
      setError("Errore di connessione. Riprova.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#c8a36a]">
            <ChefHat size={32} className="text-[#0a0a0a]" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-[#c8a36a]">Benvenuto</h1>
          <p className="text-white/70">Accedi al tuo account</p>
        </div>

        {/* Form di Login */}
        <div className="rounded-lg bg-[#232323] p-8 shadow-xl">
          <button
            onClick={() => {
              router.push("/");
            }}
            className="text-gold hover:bg-first-theme/70 ml-auto flex flex-col items-center justify-center rounded-xl p-2 duration-200 hover:cursor-pointer hover:shadow-2xl"
          >
            Home
            <House />
          </button>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-white/50"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="chef@example.com"
                  required
                  className="w-full rounded-lg border border-[#c8a36a]/30 bg-[#0a0a0a] py-3 pr-4 pl-11 text-white transition outline-none placeholder:text-white/30 focus:border-[#c8a36a]"
                />
              </div>
            </div>

            {/* Campo Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={20}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-white/50"
                />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-[#c8a36a]/30 bg-[#0a0a0a] py-3 pr-4 pl-11 text-white transition outline-none placeholder:text-white/30 focus:border-[#c8a36a]"
                />
              </div>
            </div>

            {/* Messaggio di Errore */}
            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                <AlertCircle
                  size={20}
                  className="mt-0.5 flex-shrink-0 text-red-400"
                />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Non funzionano davvero */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-white/70">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#c8a36a]/30 bg-[#0a0a0a] text-[#c8a36a] focus:ring-[#c8a36a] focus:ring-offset-0"
                />
                Ricordami
              </label>
              <a
                href="/forgot-password"
                className="text-[#c8a36a] transition hover:text-[#d4b480]"
              >
                Password dimenticata?
              </a>
            </div>

            {/* Bottone Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#c8a36a] py-3 font-semibold text-[#0a0a0a] transition hover:bg-[#d4b480] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Accesso in corso..." : "Accedi"}
            </button>
          </form>

          {/* Non funziona nemmeno questo */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white/70">
              Non hai un account?{" "}
              <a
                href="/register"
                className="font-semibold text-[#c8a36a] transition hover:text-[#d4b480]"
              >
                Registrati
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
