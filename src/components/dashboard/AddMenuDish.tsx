import { PlusCircle, X } from "lucide-react";
import { useState } from "react";
interface AddMenuDishInterface {
  isOpen: boolean;
  onSetMenuActive: () => void;
  onClose: () => void;
  onSubmit: (menuName: string, maxPeople?: number) => void;
  dishName: string;
}

export default function AddMenuDish({
  isOpen,
  onClose,
  onSubmit,
  onSetMenuActive,
  dishName,
}: AddMenuDishInterface) {
  const [menuName, setMenuName] = useState("");
  const [maxPeople, setMaxPeople] = useState<number | "">("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (menuName.trim()) {
      onSubmit(menuName, maxPeople === "" ? undefined : Number(maxPeople));
      setMenuName("");
      setMaxPeople("");
      onClose();
      onSetMenuActive();
    }
  };

  const handleCancel = () => {
    setMenuName("");
    setMaxPeople("");
    onClose();
  };

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-lg bg-[#232323] p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#c8a36a]">Crea Nuovo Menu</h3>
          <button
            onClick={handleCancel}
            className="text-white/70 transition hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4 rounded-lg bg-[#1a1a1a] p-3">
          <p className="text-sm text-white/70">
            Il piatto{" "}
            <span className="font-semibold text-[#c8a36a]">{dishName}</span>{" "}
            verrà aggiunto a questo menu
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              Nome Menu <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              className="w-full rounded-lg border border-[#c8a36a]/30 bg-[#0a0a0a] p-3 text-white transition outline-none focus:border-[#c8a36a]"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              Numero Massimo Persone (opzionale)
            </label>
            <input
              type="number"
              value={maxPeople}
              onChange={(e) =>
                setMaxPeople(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              min="1"
              className="w-full rounded-lg border border-[#c8a36a]/30 bg-[#0a0a0a] p-3 text-white transition outline-none focus:border-[#c8a36a]"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="rounded-lg bg-white/10 px-5 py-2.5 font-medium text-white transition hover:bg-white/20"
          >
            Annulla
          </button>

          <button
            onClick={handleSubmit}
            disabled={!menuName.trim()}
            className="flex items-center gap-2 rounded-lg bg-[#c8a36a] px-5 py-2.5 font-semibold text-[#0a0a0a] transition hover:bg-[#d4b480] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PlusCircle size={18} />
            Crea Menu
          </button>
        </div>
      </div>
    </section>
  );
}
