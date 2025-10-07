"use client";

import { useRef } from "react";
import { ChefInterface, PhotoInterface } from "@/app/chef/dashboard/page";
import { PlusCircle, Trash2, Upload } from "lucide-react";
import Image from "next/image";

interface PhotosComponentInterface {
  chef: ChefInterface;
  photos: PhotoInterface[];
  onUpload: (file: File) => void;
  onDelete: (id: string) => void;
}

export default function PhotosComponent({
  chef,
  photos,
  onUpload,
  onDelete,
}: PhotosComponentInterface) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          onUpload(file);
        }
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#c8a36a]">Galleria Foto</h2>
        <button
          onClick={handleUploadClick}
          className="flex items-center gap-2 rounded bg-[#c8a36a] px-4 py-2 font-semibold text-[#0a0a0a] transition hover:bg-[#d4b480]"
        >
          <PlusCircle size={18} />
          Carica Foto
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div
        className="rounded-lg border-2 border-dashed border-[#c8a36a]/30 bg-[#232323] p-12 text-center transition hover:border-[#c8a36a]/50 hover:bg-[#2a2a2a]"
        onClick={handleUploadClick}
      >
        <Upload size={48} className="mx-auto mb-4 text-[#c8a36a]" />
        <p className="mb-2 text-white">
          Clicca per caricare o trascina le immagini qui
        </p>
        <p className="text-sm text-white/50">PNG, JPG, GIF fino a 10MB</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative overflow-hidden rounded-lg bg-[#232323]"
          >
            <div className="relative aspect-square overflow-hidden bg-[#0a0a0a]">
              <Image
                src={photo.imageUrl}
                alt={photo.filename}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>

            <div className="absolute top-2 right-2 flex gap-2 opacity-0 transition group-hover:opacity-100">
              <button
                onClick={() => onDelete(photo.id)}
                className="rounded bg-red-500 p-2 text-white hover:bg-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {photos.length === 0 && (
        <div className="rounded-lg bg-[#232323] p-12 text-center">
          <Image
            src="/placeholder-image.svg"
            alt="No photos"
            width={48}
            height={48}
            className="mx-auto mb-4 opacity-30"
          />
          <p className="text-white/70">Nessuna foto caricata</p>
        </div>
      )}
    </div>
  );
}
