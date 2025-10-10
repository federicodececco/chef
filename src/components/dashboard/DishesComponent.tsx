"use client";
"use client";

import { useState, useMemo, useEffect } from "react";
import { Filter, PlusCircle } from "lucide-react";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableDishRow from "./SortableDishRow";
import {
  CategoryInterface,
  CreateDishInput,
  DishInterface,
} from "@/util/types";

interface DishesComponentInterface {
  dishes: DishInterface[];
  chefId: string;
  onAdd: (dish: CreateDishInput) => void;
  onUpdate: (
    id: string,
    dish: Partial<DishInterface> & { categoryIds?: string[] },
  ) => void;
  onDelete: (id: string) => void;
  onReorder: (dishes: DishInterface[]) => void;
  onAddMenuWithDish: (
    dishId: string,
    menuName: string,
    maxPeople?: number,
  ) => void;
  onSetMenuActive: () => void;
}

export default function DishesComponent({
  dishes,
  chefId,
  onAdd,
  onUpdate,
  onDelete,
  onAddMenuWithDish,
  onReorder,
  onSetMenuActive,
}: DishesComponentInterface) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    course: "Antipasto",
    listOrder: 1,
    categoryIds: [] as string[],
  });
  const [editData, setEditData] = useState<
    Partial<DishInterface> & { categoryIds?: string[] }
  >({});

  const courses = ["Antipasto", "Primo", "Secondo", "Contorno", "Dolce"];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const res = await fetch("/api/categories");

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Categories data is not an array:", data);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredAndSortedDishes = useMemo(() => {
    let filtered = dishes;

    if (selectedCourse !== "all") {
      filtered = filtered.filter((d) => d.course === selectedCourse);
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((dish) =>
        dish.categories?.some((cat) => cat.id === selectedCategory),
      );
    }

    return [...filtered].sort(
      (a, b) => (a.listOrder || 0) - (b.listOrder || 0),
    );
  }, [dishes, selectedCourse, selectedCategory]);

  const getCategoryCount = (categoryId: string) => {
    return dishes.filter((dish) =>
      dish.categories?.some((cat) => cat.id === categoryId),
    ).length;
  };

  const toggleFormCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  const handleAdd = () => {
    if (formData.name.trim()) {
      const maxOrder = Math.max(
        0,
        ...dishes
          .filter((d) => d.course === formData.course)
          .map((d) => d.listOrder || 0),
      );

      onAdd({
        name: formData.name,
        course: formData.course,
        listOrder: maxOrder + 1,
        chefId: chefId,
        categoryIds: formData.categoryIds,
      });

      setFormData({
        name: "",
        course: "Antipasto",
        listOrder: 1,
        categoryIds: [],
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
    setEditData({
      ...dish,
      categoryIds: dish.categories?.map((c) => c.id) || [],
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredAndSortedDishes.findIndex(
        (d) => d.id === active.id,
      );
      const newIndex = filteredAndSortedDishes.findIndex(
        (d) => d.id === over.id,
      );

      const reordered = arrayMove(filteredAndSortedDishes, oldIndex, newIndex);

      const minListOrder = Math.min(
        ...filteredAndSortedDishes.map((d) => d.listOrder || 0),
      );
      const updatedFilteredDishes = reordered.map((dish, index) => ({
        ...dish,
        listOrder: minListOrder + index,
      }));

      const finalDishes = dishes.map((dish) => {
        const updatedDish = updatedFilteredDishes.find((d) => d.id === dish.id);
        return updatedDish || dish;
      });

      console.log(
        "Original dishes:",
        dishes.map((d) => ({ id: d.id, order: d.listOrder })),
      );
      console.log(
        "Reordered dishes:",
        finalDishes.map((d) => ({ id: d.id, order: d.listOrder })),
      );

      onReorder(finalDishes);
    }
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

      {/* Course Filter Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-[#c8a36a]" />
          <span className="text-sm font-semibold text-white/70">
            Filtra per Portata
          </span>
        </div>
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCourse("all")}
            className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
              selectedCourse === "all"
                ? "bg-[#c8a36a] text-[#0a0a0a]"
                : "bg-[#232323] text-white/70 hover:bg-[#2a2a2a]"
            }`}
          >
            Tutti ({dishes.length})
          </button>
          {courses.map((course) => {
            const count = dishes.filter((d) => d.course === course).length;
            return (
              <button
                key={course}
                onClick={() => setSelectedCourse(course)}
                className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
                  selectedCourse === course
                    ? "bg-[#c8a36a] text-[#0a0a0a]"
                    : "bg-[#232323] text-white/70 hover:bg-[#2a2a2a]"
                }`}
              >
                {course} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      {isLoadingCategories ? (
        <div className="rounded-lg bg-[#232323] p-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="loading loading-dots loading-xs text-gold"></span>
          </div>
        </div>
      ) : categories.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-[#c8a36a]" />
            <span className="text-sm font-semibold text-white/70">
              Filtra per Categoria
            </span>
          </div>
          <div className="rounded-lg bg-[#232323] p-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === "all"
                    ? "bg-[#c8a36a] text-[#0a0a0a]"
                    : "bg-[#0a0a0a] text-white/70 hover:bg-[#1a1a1a]"
                }`}
              >
                Tutte le categorie ({dishes.length})
              </button>
              {categories.map((category) => {
                const count = getCategoryCount(category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      selectedCategory === category.id
                        ? "bg-[#c8a36a] text-[#0a0a0a]"
                        : "bg-[#0a0a0a] text-white/70 hover:bg-[#1a1a1a]"
                    }`}
                  >
                    {category.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-white/10 bg-[#232323] p-6 text-center">
          <p className="text-white/50">
            Nessuna categoria disponibile. Aggiungi delle categorie per
            organizzare meglio i tuoi piatti.
          </p>
        </div>
      )}

      {/* Active Filters Info */}
      {(selectedCourse !== "all" || selectedCategory !== "all") && (
        <div className="flex items-center justify-between rounded-lg bg-[#c8a36a]/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[#c8a36a]" />
            <span className="text-sm text-white">
              Filtri attivi: {filteredAndSortedDishes.length} piatti trovati
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedCourse("all");
              setSelectedCategory("all");
            }}
            className="text-sm font-semibold text-[#c8a36a] hover:text-[#d4b480]"
          >
            Rimuovi filtri
          </button>
        </div>
      )}

      {/* Dishes Table */}
      <div className="overflow-hidden rounded-lg bg-[#232323]">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table className="w-full">
            <thead className="bg-[#0a0a0a]">
              <tr>
                <th className="p-4 text-left text-[#c8a36a]">Nome</th>
                <th className="p-4 text-left text-[#c8a36a]">Portata</th>
                <th className="p-4 text-left text-[#c8a36a]">Categorie</th>
                <th className="p-4 text-right text-[#c8a36a]"></th>
              </tr>
            </thead>
            <tbody>
              <SortableContext
                items={filteredAndSortedDishes.map((d) => d.id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredAndSortedDishes.map((dish) => (
                  <SortableDishRow
                    onSetMenuActive={onSetMenuActive}
                    key={dish.id}
                    dish={dish}
                    editingId={editingId}
                    editData={editData}
                    courses={courses}
                    categories={categories}
                    onEditChange={setEditData}
                    onUpdate={() => handleUpdate(dish.id)}
                    onCancelEdit={() => setEditingId(null)}
                    onStartEdit={() => startEdit(dish)}
                    onDelete={() => onDelete(dish.id)}
                    onAddMenuWithDish={onAddMenuWithDish}
                  />
                ))}
              </SortableContext>
            </tbody>
          </table>
        </DndContext>

        {filteredAndSortedDishes.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-white/50">
              {selectedCourse === "all"
                ? "Nessun piatto aggiunto"
                : `Nessun piatto nella categoria ${selectedCourse}`}
            </p>
          </div>
        )}
      </div>

      {/* Add Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-[#232323] p-6">
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
                  placeholder="Es: Spaghetti alle vongole"
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
                <label className="mb-2 block text-white/70">
                  Categorie{" "}
                  {formData.categoryIds.length > 0 &&
                    `(${formData.categoryIds.length} selezionate)`}
                </label>
                <div className="flex min-h-[60px] flex-wrap gap-2 rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-3">
                  {isLoadingCategories ? (
                    <p className="text-sm text-white/50">Caricamento...</p>
                  ) : categories.length > 0 ? (
                    categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleFormCategory(cat.id)}
                        className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                          formData.categoryIds.includes(cat.id)
                            ? "bg-[#c8a36a] text-[#0a0a0a]"
                            : "bg-[#1a1a1a] text-white/70 hover:bg-[#2a2a2a]"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-white/50">
                      Nessuna categoria disponibile
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    name: "",
                    course: "Antipasto",
                    listOrder: 1,
                    categoryIds: [],
                  });
                }}
                className="rounded bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
              >
                Annulla
              </button>
              <button
                onClick={handleAdd}
                disabled={!formData.name.trim()}
                className="rounded bg-[#c8a36a] px-4 py-2 font-semibold text-[#0a0a0a] transition hover:bg-[#d4b480] disabled:cursor-not-allowed disabled:opacity-50"
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
