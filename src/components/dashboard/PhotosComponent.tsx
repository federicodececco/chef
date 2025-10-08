"use client";

import { useRef, useState } from "react";
import {
  ChefInterface,
  PhotoInterface,
} from "@/app/chef/dashboard/[chefId]/page";
import { PlusCircle, Trash2, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import axiosInstance from "@/lib/axios";

interface PhotosComponentInterface {
  chef: ChefInterface;
  photos: PhotoInterface[];
  onUpload: (photo: PhotoInterface) => void;
  onDelete: (id: string) => void;
}

export default function PhotosComponent({
  chef,
  photos,
  onUpload,
  onDelete,
}: PhotosComponentInterface) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          let width = img.width;
          let height = img.height;
          const maxSize = 1920;

          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error("Errore nella compressione"));
              }
            },
            "image/jpeg",
            0.85,
          );
        };

        img.onerror = reject;
      };

      reader.onerror = reject;
    });
  };

  const uploadFile = async (file: File) => {
    try {
      setUploadProgress((prev) => [...prev, file.name]);

      const compressedFile = await compressImage(file);

      const formData = new FormData();
      formData.append("photo", compressedFile);
      formData.append("chefId", chef.id);
      formData.append("type", "gallery");

      const res = await axiosInstance.post("/photos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });

      if (res.data.success) {
        onUpload(res.data.photo);
      }

      setUploadProgress((prev) => prev.filter((name) => name !== file.name));
    } catch (error) {
      console.error(`Errore upload ${file.name}:`, error);
      alert(`Errore durante l'upload di ${file.name}`);
      setUploadProgress((prev) => prev.filter((name) => name !== file.name));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (imageFiles.length === 0) {
      alert("Seleziona almeno un'immagine valida");
      return;
    }

    setIsUploading(true);
    setUploadProgress([]);

    for (const file of imageFiles) {
      await uploadFile(file);
    }

    setIsUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (files.length === 0) {
      alert("Trascina almeno un'immagine valida");
      return;
    }

    setIsUploading(true);
    setUploadProgress([]);

    for (const file of files) {
      await uploadFile(file);
    }

    setIsUploading(false);
  };

  const handleDelete = async (photo: PhotoInterface) => {
    try {
      await axiosInstance.delete(`/photos/${photo.id}`);
      onDelete(photo.id);
    } catch (error) {
      console.error("Errore eliminazione foto:", error);
      alert("Errore durante l'eliminazione della foto");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#c8a36a]">Galleria Foto</h2>
        <button
          onClick={handleUploadClick}
          disabled={isUploading}
          className="flex items-center gap-2 rounded bg-[#c8a36a] px-4 py-2 font-semibold text-[#0a0a0a] transition hover:bg-[#d4b480] disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <PlusCircle size={18} />
          )}
          {isUploading ? "Caricamento..." : "Carica Foto"}
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

      {/* Drag and Drop Area */}
      <div
        className={`rounded-lg border-2 border-dashed bg-[#232323] p-12 text-center transition ${
          isUploading
            ? "border-[#c8a36a] bg-[#2a2a2a]"
            : "cursor-pointer border-[#c8a36a]/30 hover:border-[#c8a36a]/50 hover:bg-[#2a2a2a]"
        }`}
        onClick={!isUploading ? handleUploadClick : undefined}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="space-y-4">
            <Loader2
              size={48}
              className="mx-auto animate-spin text-[#c8a36a]"
            />
            <div>
              <p className="mb-2 text-white">Upload in corso...</p>
              {uploadProgress.length > 0 && (
                <div className="space-y-1">
                  {uploadProgress.map((filename) => (
                    <p key={filename} className="text-sm text-white/50">
                      • {filename}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <Upload size={48} className="mx-auto mb-4 text-[#c8a36a]" />
            <p className="mb-2 text-white">
              Clicca per caricare o trascina le immagini qui
            </p>
          </>
        )}
      </div>

      {/* Gallery Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-lg bg-[#232323] transition hover:ring-2 hover:ring-[#c8a36a]"
            >
              <div className="relative aspect-square overflow-hidden bg-[#0a0a0a]">
                <Image
                  src={photo.imageUrl}
                  alt={photo.filename}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>

              {/* Overlay with actions */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => handleDelete(photo)}
                  className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                >
                  <Trash2 size={16} />
                  Elimina
                </button>
              </div>

              {/* Filename tooltip */}
              <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                <p className="truncate text-xs text-white">{photo.filename}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {photos.length === 0 && !isUploading && (
        <div className="rounded-lg bg-[#232323] p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#c8a36a]/10">
            <Upload size={32} className="text-[#c8a36a]/50" />
          </div>
          <p className="mb-2 text-white/70">Nessuna foto caricata</p>
          <p className="text-sm text-white/50">
            Inizia caricando le tue prime foto
          </p>
        </div>
      )}
    </div>
  );
}
