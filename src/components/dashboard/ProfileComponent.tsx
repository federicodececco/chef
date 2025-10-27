"use client";

import { useState, useRef } from "react";
import { Save, Camera, Upload, Sparkles } from "lucide-react";
import { ChefComplete } from "@/util/types";
import Image from "next/image";
import axiosInstance from "@/lib/axios";
import CityMapSelector from "./CityMapSelector";

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
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isOptimizingSeo, setIsOptimizingSeo] = useState(false);
  const [city, setCity] = useState("");

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setIsSaving(true);
    if (city != "") {
      localChef.city = city;
    }

    try {
      /* save simple modification */
      await onUpdate(localChef);

      /* optimeze the seo based on the new infos */
      optimizeSeoInBackground();
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  /*optimize seo in background  */
  const optimizeSeoInBackground = async () => {
    try {
      await axiosInstance.post("/seo/generate", {
        chefId: chef.id,
      });
    } catch (error) {
      throw error;
    }
  };

  const handleImageUpload = async (file: File, type: "avatar" | "cover") => {
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("chefId", chef.id);
    formData.append("type", type);

    try {
      if (type === "avatar") {
        setIsUploadingAvatar(true);
      } else {
        setIsUploadingCover(true);
      }

      const res = await axiosInstance.post("/photos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        const updatedChef = {
          ...localChef,
          ...(type === "avatar"
            ? { avatarUrl: res.data.photo.imageUrl }
            : { coverUrl: res.data.photo.imageUrl }),
        };
        setLocalChef(updatedChef);
        onUpdate(updatedChef);
      }
    } catch (error) {
      alert(
        `Errore durante l'upload della ${type === "avatar" ? "foto profilo" : "cover"}`,
      );
    } finally {
      if (type === "avatar") {
        setIsUploadingAvatar(false);
      } else {
        setIsUploadingCover(false);
      }
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file, "avatar");
    }
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file, "cover");
    }
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const handleOptimizeSeo = async () => {
    setIsOptimizingSeo(true);
    try {
      const res = await axiosInstance.post("/seo/generate", {
        chefId: chef.id,
      });
    } catch (error) {
      throw error;
    } finally {
      setIsOptimizingSeo(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cover Image Section */}
      <div className="relative overflow-hidden rounded-lg bg-[#232323]">
        <div className="relative h-64 w-full bg-gradient-to-br from-[#c8a36a]/20 to-[#0a0a0a]">
          {localChef.coverUrl ? (
            <Image
              src={localChef.coverUrl}
              alt="Cover"
              fill
              sizes=""
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Upload size={48} className="text-white/30" />
            </div>
          )}

          <button
            onClick={() => coverInputRef.current?.click()}
            disabled={isUploadingCover}
            className="absolute top-4 right-4 flex items-center gap-2 rounded-lg bg-[#232323]/90 px-4 py-2 text-white backdrop-blur-sm transition hover:bg-[#2a2a2a] disabled:opacity-50"
          >
            <Camera size={18} />
            {isUploadingCover ? "Caricamento..." : "Cambia Cover"}
          </button>

          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />
        </div>

        {/* Avatar Section */}
        <div className="relative -mt-16 px-6 pb-6">
          <div className="relative inline-block">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-[#232323] bg-[#0a0a0a]">
              {localChef.avatarUrl ? (
                <Image
                  src={localChef.avatarUrl}
                  alt={`${chef.user?.firstname || ""} ${chef.user?.lastname || ""}`}
                  fill
                  sizes="180"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#c8a36a]/20 to-[#0a0a0a]">
                  <Camera size={32} className="text-white/30" />
                </div>
              )}
            </div>

            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute right-0 bottom-0 rounded-full bg-[#c8a36a] p-2 text-[#0a0a0a] transition hover:bg-[#d4b480] disabled:opacity-50"
            >
              {isUploadingAvatar ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0a0a0a] border-t-transparent" />
              ) : (
                <Camera size={20} />
              )}
            </button>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Profile Information */}
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
              placeholder="Una breve descrizione"
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
              placeholder="Es: Roma"
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
              placeholder="Es: Italia"
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
              placeholder="+39 123 456 7890"
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
              placeholder="Racconta la tua storia culinaria..."
              className="w-full rounded border border-[#c8a36a]/30 bg-[#0a0a0a] p-3 text-white outline-none focus:border-[#c8a36a]"
            />
          </div>
          <CityMapSelector city={city} setCity={setCity}></CityMapSelector>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 rounded bg-[#c8a36a] px-6 py-3 font-semibold text-[#0a0a0a] transition hover:bg-[#d4b480] disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? "Salvataggio..." : "Salva Modifiche"}
          </button>
        </div>
      </div>
    </div>
  );
}
