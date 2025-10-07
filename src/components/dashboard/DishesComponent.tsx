"use client";

import { useState } from "react";
import {
  ChefInterface,
  DishInterface,
  MenuInterface,
} from "@/app/chef/dashboard/page";
import { Edit, PlusCircle, Trash2, X, Check } from "lucide-react";

interface DishesComponentInterface {
  chef: ChefInterface;
  dishes: DishInterface[];
  menus: MenuInterface[];
  onAdd: (dish: Omit<DishInterface, "id">) => void;
  onUpdate: (id: string, dish: Partial<DishInterface>) => void;
  onDelete: (id: string) => void;
}

export default function DishesComponent({
  chef,
  dishes,
  menus,
  onAdd,
  onUpdate,
  onDelete,
}: DishesComponentInterface) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    course: "Antipasto",
    menuId: menus[0]?.id || "",
    listOrder: 1,
  });
  const [editData, setEditData] = useState<Partial<DishInterface>>({});

  const courses = ["Antipasto", "Primo", "Secondo", "Contorno", "Dolce"];

  const handleAdd = () => {
    if (formData.name.trim()) {
      onAdd(formData);
      setFormData({
        name: "",
        course: "Antipasto",
        menuId: menus[0]?.id || "",
        listOrder: 1,
      });
      setShowAddModal(false);
    }
  };

  const handleUpdate = (id: string) => {
    onUpdate(id, editData);
    setEditingId(null);
    setEditData({});
  };

  const startEdit = (dish: DishInterface) => {
    setEditingId(dish.id);
    setEditData(dish);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#c8a36a]">Piatti</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded bg-[#c8a36a] px-4 py-2 font-semibold text-[#0a0a0a] transition hover:bg-[#d4b480]"
        >
          <PlusCircle size={18} />
          Nuovo Piatto
        </button>
      </div>

      <div className="overflow-hidden rounded-lg bg-[#232323]">
        <table className="w-full">
          <thead className="bg-[#0a0a0a]">
            <tr>
              <th className="p-4 text-left text-[#c8a36a]">Nome</th>
              <th className="p-4 text-left text-[#c8a36a]">Portata</th>
              <th className="p-4 text-left text-[#c8a36a]">Ordine</th>
              <th className="p-4 text-right text-[#c8a36a]">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {dishes.map((dish) => (
              <tr
                key={dish.id}
                className="border-t border-white/10 hover:bg-[#2a2a2a]"
              >
                <td className="p-4">
                  {editingId === dish.id ? (
                    <input
                      type="text"
                      value={editData.name || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="w-full rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-2 text-white outline-none focus:border-[#c8a36a]"
                    />
                  ) : (
                    <span className="text-white">{dish.name}</span>
                  )}
                </td>
                <td className="p-4">
                  {editingId === dish.id ? (
                    <select
                      value={editData.course || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, course: e.target.value })
                      }
                      className="w-full rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-2 text-white outline-none focus:border-[#c8a36a]"
                    >
                      {courses.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-white/70">{dish.course}</span>
                  )}
                </td>
                <td className="p-4">
                  {editingId === dish.id ? (
                    <input
                      type="number"
                      value={editData.listOrder || 0}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          listOrder: parseInt(e.target.value),
                        })
                      }
                      className="w-20 rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-2 text-white outline-none focus:border-[#c8a36a]"
                    />
                  ) : (
                    <span className="text-white/70">{dish.listOrder}</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {editingId === dish.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(dish.id)}
                          className="text-green-400 hover:text-green-300"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-white/70 hover:text-white"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(dish)}
                          className="text-[#c8a36a] hover:text-[#d4b480]"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(dish.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* modale per aggiungere piatto */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-[#232323] p-6">
            <h3 className="mb-4 text-xl font-bold text-[#c8a36a]">
              Nuovo Piatto
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-white/70">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-3 text-white outline-none focus:border-[#c8a36a]"
                />
              </div>
              <div>
                <label className="mb-2 block text-white/70">Portata</label>
                <select
                  value={formData.course}
                  onChange={(e) =>
                    setFormData({ ...formData, course: e.target.value })
                  }
                  className="w-full rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-3 text-white outline-none focus:border-[#c8a36a]"
                >
                  {courses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-white/70">Menu</label>
                <select
                  value={formData.menuId}
                  onChange={(e) =>
                    setFormData({ ...formData, menuId: e.target.value })
                  }
                  className="w-full rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-3 text-white outline-none focus:border-[#c8a36a]"
                >
                  {menus.map((menu) => (
                    <option key={menu.id} value={menu.id}>
                      {menu.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-white/70">Ordine</label>
                <input
                  type="number"
                  value={formData.listOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      listOrder: parseInt(e.target.value),
                    })
                  }
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
                Crea Piatto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
