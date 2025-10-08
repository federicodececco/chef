"use client";

import { useState } from "react";
import {
  DishInterface,
  MenuInterface,
} from "@/app/chef/dashboard/[chefId]/page";
import {
  Edit,
  PlusCircle,
  Trash2,
  X,
  Check,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Menu } from "@prisma/client";

interface MenuComponentInterface {
  menus: MenuInterface[];
  dishes: DishInterface[];
  onAddMenu: (menu: Omit<MenuInterface, "id">) => void;
  onUpdateMenu: (id: string, menu: Partial<MenuInterface>) => void;
  onDeleteMenu: (id: string) => void;
  onAddDishToMenu: (menuId: string, dishId: string) => void;
  onRemoveDishFromMenu: (menuId: string, dishId: string) => void;
  onReorderDishes: (menuId: string, dishes: DishInterface[]) => void;
}

interface SortableDishItemProps {
  dish: DishInterface;
  onRemove: () => void;
}

function SortableDishItem({ dish, onRemove }: SortableDishItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: dish.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg bg-[#2a2a2a] p-4 transition"
    >
      <div {...attributes} {...listeners} className="cursor-move touch-none">
        <GripVertical size={20} className="text-white/50" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-white">{dish.name}</p>
        <p className="text-sm text-white/50">{dish.course}</p>
      </div>
      <button onClick={onRemove} className="text-red-400 hover:text-red-300">
        <Trash2 size={18} />
      </button>
    </div>
  );
}

export default function MenuComponent({
  menus,
  dishes,
  onAddMenu,
  onUpdateMenu,
  onDeleteMenu,
  onAddDishToMenu,
  onRemoveDishFromMenu,
  onReorderDishes,
}: MenuComponentInterface) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    maxPeople: 0,
  });
  const [editData, setEditData] = useState<Partial<MenuInterface>>({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const selectedMenu = menus.find((m) => m.id === selectedMenuId);

  // Ottieni i piatti del menu selezionato
  const menuDishes = selectedMenu
    ? dishes
        .filter((dish) => dish.Menus?.some((m) => m.id === selectedMenuId))
        .sort((a, b) => (a.listOrder || 0) - (b.listOrder || 0))
    : [];

  // Piatti disponibili da aggiungere (non ancora nel menu)
  const availableDishes = dishes.filter(
    (dish) => !dish.Menus?.some((m: Menu) => m.id === selectedMenuId),
  );

  const handleAdd = () => {
    if (formData.name.trim()) {
      onAddMenu(formData);
      setFormData({ name: "", maxPeople: 0 });
      setShowAddModal(false);
    }
  };

  const handleUpdate = (id: string) => {
    onUpdateMenu(id, editData);
    setEditingId(null);
    setEditData({});
  };

  const startEdit = (menu: MenuInterface) => {
    setEditingId(menu.id);
    setEditData(menu);
  };

  const handleAddDish = (dishId: string) => {
    if (selectedMenuId) {
      onAddDishToMenu(selectedMenuId, dishId);
      setShowAddDishModal(false);
    }
  };

  const handleRemoveDish = (dishId: string) => {
    if (selectedMenuId) {
      onRemoveDishFromMenu(selectedMenuId, dishId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && selectedMenuId) {
      const oldIndex = menuDishes.findIndex((dish) => dish.id === active.id);
      const newIndex = menuDishes.findIndex((dish) => dish.id === over.id);

      const reorderedDishes = arrayMove(menuDishes, oldIndex, newIndex);
      onReorderDishes(selectedMenuId, reorderedDishes);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#c8a36a]">Menu</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded bg-[#c8a36a] px-4 py-2 font-semibold text-[#0a0a0a] transition hover:bg-[#d4b480]"
        >
          <PlusCircle size={18} />
          Nuovo Menu
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lista Menu */}
        <div className="lg:col-span-1">
          <div className="space-y-3">
            {menus.map((menu) => (
              <div
                key={menu.id}
                className={`rounded-lg bg-[#232323] p-4 transition ${
                  selectedMenuId === menu.id
                    ? "ring-2 ring-[#c8a36a]"
                    : "hover:bg-[#2a2a2a]"
                }`}
              >
                {editingId === menu.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editData.name || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="w-full rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-2 text-white outline-none focus:border-[#c8a36a]"
                    />
                    <input
                      type="number"
                      value={editData.maxPeople || 0}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          maxPeople: parseInt(e.target.value),
                        })
                      }
                      placeholder="Max persone"
                      className="w-full rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-2 text-white outline-none focus:border-[#c8a36a]"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleUpdate(menu.id)}
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
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 flex items-start justify-between">
                      <button
                        onClick={() => setSelectedMenuId(menu.id)}
                        className="flex-1 text-left"
                      >
                        <h3 className="text-lg font-semibold text-[#c8a36a]">
                          {menu.name}
                        </h3>
                        <p className="text-sm text-white/50">
                          {menu.Dishes?.length || 0} piatti
                          {menu.maxPeople && ` • Max ${menu.maxPeople} persone`}
                        </p>
                      </button>
                      <ChevronRight
                        size={20}
                        className={`text-white/50 transition ${
                          selectedMenuId === menu.id ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(menu)}
                        className="text-[#c8a36a] hover:text-[#d4b480]"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDeleteMenu(menu.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {menus.length === 0 && (
              <div className="rounded-lg bg-[#232323] p-12 text-center">
                <p className="text-white/70">Nessun menu creato</p>
              </div>
            )}
          </div>
        </div>

        {/* Dettagli Menu Selezionato */}
        <div className="lg:col-span-2">
          {selectedMenu ? (
            <div className="rounded-lg bg-[#232323] p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#c8a36a]">
                  {selectedMenu.name}
                </h3>
                <button
                  onClick={() => setShowAddDishModal(true)}
                  className="flex items-center gap-2 rounded bg-[#c8a36a] px-4 py-2 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#d4b480]"
                >
                  <PlusCircle size={16} />
                  Aggiungi Piatto
                </button>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={menuDishes.map((d) => d.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {menuDishes.length > 0 ? (
                      menuDishes.map((dish) => (
                        <SortableDishItem
                          key={dish.id}
                          dish={dish}
                          onRemove={() => handleRemoveDish(dish.id)}
                        />
                      ))
                    ) : (
                      <div className="rounded-lg border-2 border-dashed border-white/10 p-12 text-center">
                        <p className="text-white/50">
                          Nessun piatto in questo menu
                        </p>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg bg-[#232323] p-12">
              <p className="text-white/50">
                Seleziona un menu per visualizzare i dettagli
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Aggiungi Menu */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-[#232323] p-6">
            <h3 className="mb-4 text-xl font-bold text-[#c8a36a]">
              Nuovo Menu
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
                <label className="mb-2 block text-white/70">
                  Max Persone (opzionale)
                </label>
                <input
                  type="number"
                  value={formData.maxPeople || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxPeople: parseInt(e.target.value) || 0,
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
                Crea Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* modale Aggiungi Piatto al Menu */}
      {showAddDishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-[#232323] p-6">
            <h3 className="mb-4 text-xl font-bold text-[#c8a36a]">
              Aggiungi Piatto al Menu
            </h3>
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {availableDishes.length > 0 ? (
                availableDishes.map((dish) => (
                  <button
                    key={dish.id}
                    onClick={() => handleAddDish(dish.id)}
                    className="w-full rounded-lg bg-[#2a2a2a] p-4 text-left transition hover:bg-[#333333]"
                  >
                    <p className="font-semibold text-white">{dish.name}</p>
                    <p className="text-sm text-white/50">{dish.course}</p>
                  </button>
                ))
              ) : (
                <p className="p-4 text-center text-white/50">
                  Tutti i piatti sono già stati aggiunti a questo menu
                </p>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAddDishModal(false)}
                className="rounded bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
