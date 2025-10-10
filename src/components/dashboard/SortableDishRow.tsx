import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Check,
  ClipboardPlus,
  Edit,
  GripVertical,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { CategoryInterface, DishInterface } from "@/util/types";
import { useState } from "react";
import AddMenuDish from "./AddMenuDish";
interface SortableDishInterface {
  dish: DishInterface;
  editingId: string | null;
  editData: Partial<DishInterface> & { categoryIds?: string[] };
  courses: string[];
  categories: CategoryInterface[];
  onEditChange: (
    data: Partial<DishInterface> & { categoryIds?: string[] },
  ) => void;
  onUpdate: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
  onAddMenuWithDish: (
    menuName: string,
    dishId: string,
    maxPeople?: number,
  ) => void;
  onSetMenuActive: () => void;
}

export default function SortableDishRow({
  dish,
  onSetMenuActive,
  editingId,
  editData,
  categories,
  courses,
  onEditChange,
  onUpdate,
  onCancelEdit,
  onStartEdit,
  onDelete,
  onAddMenuWithDish,
}: SortableDishInterface) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: dish.id });
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isEditing = editingId === dish.id;

  const toggleCategory = (categoryId: string) => {
    const currentIds = editData.categoryIds || [];
    const newIds = currentIds.includes(categoryId)
      ? currentIds.filter((id) => id !== categoryId)
      : [...currentIds, categoryId];
    onEditChange({ ...editData, categoryIds: newIds });
  };
  const handleCreateMenu = (menuName: string, maxPeople?: number) => {
    if (onAddMenuWithDish) {
      onAddMenuWithDish(menuName, dish.id, maxPeople);
    }
  };

  return (
    <>
      <tr
        ref={setNodeRef}
        style={style}
        className="border-t border-white/10 hover:bg-[#2a2a2a]"
      >
        <td className="p-4">
          <div className="flex items-center gap-2">
            <div
              {...attributes}
              {...listeners}
              className="cursor-move touch-none text-white/50 hover:text-white/80"
            >
              <GripVertical size={18} />
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editData.name || ""}
                onChange={(e) =>
                  onEditChange({ ...editData, name: e.target.value })
                }
                className="w-full rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-2 text-white outline-none focus:border-[#c8a36a]"
              />
            ) : (
              <span className="text-white">{dish.name}</span>
            )}
          </div>
        </td>
        <td className="p-4">
          {isEditing ? (
            <select
              value={editData.course || ""}
              onChange={(e) =>
                onEditChange({ ...editData, course: e.target.value })
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
          {isEditing ? (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    editData.categoryIds?.includes(cat.id)
                      ? "bg-[#c8a36a] text-[#0a0a0a]"
                      : "bg-[#0a0a0a] text-white/70 hover:bg-[#1a1a1a]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1">
              {dish.Categories && dish.Categories.length > 0 ? (
                dish.Categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="flex items-center gap-1 rounded-full bg-[#c8a36a]/20 px-2 py-1 text-xs text-[#c8a36a]"
                  >
                    <Tag size={12} />
                    {cat.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-white/50">Nessuna categoria</span>
              )}
            </div>
          )}
        </td>

        <td className="p-4 text-right">
          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={onUpdate}
                  className="text-green-400 hover:text-green-300"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={onCancelEdit}
                  className="text-white/70 hover:text-white"
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <>
                <button className="text-[#c8a36a] hover:text-[#d4b480]">
                  <ClipboardPlus
                    size={18}
                    onClick={() => setIsMenuPopupOpen(true)}
                  />
                </button>
                <button
                  onClick={onStartEdit}
                  className="text-[#c8a36a] hover:text-[#d4b480]"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={onDelete}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
      <AddMenuDish
        onSetMenuActive={onSetMenuActive}
        isOpen={isMenuPopupOpen}
        onClose={() => setIsMenuPopupOpen(false)}
        onSubmit={handleCreateMenu}
        dishName={dish.name}
      />
    </>
  );
}
