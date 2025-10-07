"use client";

import { useState } from "react";
import { ChefComplete } from "@/util/types";

interface ProfileComponentInterface {
  chef: ChefComplete;
  onUpdate: (chef: ChefComplete) => void;
}

export default function ProfileComponent({
  chef,
  onUpdate,
}: ProfileComponentInterface) {
  const [localChef, setLocalChef] = useState<ChefComplete>(chef);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdate(localChef);
    setTimeout(() => setIsSaving(false), 500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-[#232323] p-6">
        <h2 className="mb-6 text-2xl font-bold text-[#c8a36a]">
          Informazioni Profilo
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-white/70">Bio Breve</label>
            <input
              type="text"
              value={localChef.bioBrief || ""}
              onChange={(e) =>
                setLocalChef({ ...localChef, bioBrief: e.target.value })
              }
              className="w-full rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-3 text-white outline-none focus:border-[#c8a36a]"
            />
          </div>

          <div>
            <label className="mb-2 block text-white/70">Città</label>
            <input
              type="text"
              value={localChef.city || ""}
              onChange={(e) =>
                setLocalChef({ ...localChef, city: e.target.value })
              }
              className="w-full rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-3 text-white outline-none focus:border-[#c8a36a]"
            />
          </div>

          <div>
            <label className="mb-2 block text-white/70">Nazione</label>
            <input
              type="text"
              value={localChef.nation || ""}
              onChange={(e) =>
                setLocalChef({ ...localChef, nation: e.target.value })
              }
              className="w-full rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-3 text-white outline-none focus:border-[#c8a36a]"
            />
          </div>

          <div>
            <label className="mb-2 block text-white/70">Telefono</label>
            <input
              type="text"
              value={localChef.phoneNumber || ""}
              onChange={(e) =>
                setLocalChef({ ...localChef, phoneNumber: e.target.value })
              }
              className="w-full rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-3 text-white outline-none focus:border-[#c8a36a]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-white/70">Bio Completa</label>
            <textarea
              value={localChef.bio || ""}
              onChange={(e) =>
                setLocalChef({ ...localChef, bio: e.target.value })
              }
              rows={4}
              className="w-full rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-3 text-white outline-none focus:border-[#c8a36a]"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-6 flex items-center gap-2 rounded bg-[#c8a36a] px-6 py-2 font-semibold text-[#0a0a0a] transition hover:bg-[#d4b480] disabled:opacity-50"
        >
          {isSaving ? "Salvataggio..." : "Salva Modifiche"}
        </button>
      </div>
    </div>
  );
}
