import { DishInterface } from "@/util/types";
import { useSortable } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";

interface SortableDishItemInterface {
  dish: DishInterface;
  onRemove: () => void;
}

export default function SortableDishItem({
  dish,
  onRemove,
}: SortableDishItemInterface) {
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
