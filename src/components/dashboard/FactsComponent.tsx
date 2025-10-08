"use client";

import { useState } from "react";
import { FactInterface } from "@/app/chef/dashboard/[chefId]/page";
import { Edit, PlusCircle, Trash2, X, Check } from "lucide-react";

interface FactsComponentInterface {
  facts: FactInterface[];
  onAdd: (fact: Omit<FactInterface, "id">) => void;
  onUpdate: (id: string, fact: Partial<FactInterface>) => void;
  onDelete: (id: string) => void;
}

export default function FactsComponent({
  facts,
  onAdd,
  onUpdate,
  onDelete,
}: FactsComponentInterface) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    short: "",
    long: "",
  });
  const [editData, setEditData] = useState<Partial<FactInterface>>({});

  const handleAdd = () => {
    if (formData.short.trim() && formData.long.trim()) {
      onAdd(formData);
      setFormData({ short: "", long: "" });
      setShowAddModal(false);
    }
  };

  const handleUpdate = (id: string) => {
    if (editData.short?.trim() && editData.long?.trim()) {
      onUpdate(id, editData);
      setEditingId(null);
      setEditData({});
    }
  };

  const startEdit = (fact: FactInterface) => {
    setEditingId(fact.id);
    setEditData(fact);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#c8a36a]">
          Fatti Interessanti
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded bg-[#c8a36a] px-4 py-2 font-semibold text-[#0a0a0a] transition hover:bg-[#d4b480]"
        >
          <PlusCircle size={18} />
          Nuovo Fatto
        </button>
      </div>

      <div className="space-y-4">
        {facts.map((fact) => (
          <div key={fact.id} className="rounded-lg bg-[#232323] p-6">
            {editingId === fact.id ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-white/70">Titolo</label>
                  <input
                    type="text"
                    value={editData.short || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, short: e.target.value })
                    }
                    className="w-full rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-3 text-white outline-none focus:border-[#c8a36a]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-white/70">
                    Descrizione
                  </label>
                  <textarea
                    value={editData.long || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, long: e.target.value })
                    }
                    rows={3}
                    className="w-full rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-3 text-white outline-none focus:border-[#c8a36a]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleUpdate(fact.id)}
                    className="flex items-center gap-2 rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
                  >
                    <Check size={18} />
                    Salva
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex items-center gap-2 rounded bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
                  >
                    <X size={18} />
                    Annulla
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-[#c8a36a]">
                    {fact.short}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(fact)}
                      className="text-[#c8a36a] hover:text-[#d4b480]"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(fact.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-white/70">{fact.long}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {facts.length === 0 && (
        <div className="rounded-lg bg-[#232323] p-12 text-center">
          <p className="text-white/70">Nessun fatto interessante aggiunto</p>
        </div>
      )}

      {/* Modal per aggiungere fatto */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-[#232323] p-6">
            <h3 className="mb-4 text-xl font-bold text-[#c8a36a]">
              Nuovo Fatto Interessante
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-white/70">Titolo</label>
                <input
                  type="text"
                  value={formData.short}
                  onChange={(e) =>
                    setFormData({ ...formData, short: e.target.value })
                  }
                  placeholder="Es: Stella Michelin"
                  className="w-full rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-3 text-white outline-none focus:border-[#c8a36a]"
                />
              </div>
              <div>
                <label className="mb-2 block text-white/70">Descrizione</label>
                <textarea
                  value={formData.long}
                  onChange={(e) =>
                    setFormData({ ...formData, long: e.target.value })
                  }
                  placeholder="Descrizione dettagliata..."
                  rows={4}
                  className="w-full rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-3 text-white outline-none focus:border-[#c8a36a]"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
              >
                Annulla
              </button>
              <button
                onClick={handleAdd}
                className="rounded bg-[#c8a36a] px-4 py-2 font-semibold text-[#0a0a0a] transition hover:bg-[#d4b480]"
              >
                Crea Fatto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
