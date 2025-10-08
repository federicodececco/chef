"use client";

import { useEffect, useState } from "react";
import {
  ChefHat,
  User,
  Menu as MenuIcon,
  Image,
  Utensils,
  Star,
  MessageSquare,
} from "lucide-react";
import ProfileComponent from "@/components/dashboard/ProfileComponent";
import MenuComponent from "@/components/dashboard/MenuComponent";
import DishesComponent from "@/components/dashboard/DishesComponent";
import PhotosComponent from "@/components/dashboard/PhotosComponent";
import FactsComponent from "@/components/dashboard/FactsComponent";
import ReviewComponent from "@/components/dashboard/ReviewComponent";
import MessagesComponent from "@/components/dashboard/MessaggesComponent";
import axiosIstance from "@/lib/axios";
import { ChefComplete } from "@/util/types";
import { useRouter, useParams } from "next/navigation";
export interface ChefInterface {
  id: string;
  bio?: string;
  bioBrief?: string;
  avatarUrl?: string;
  coverUrl?: string;
  phoneNumber?: string;
  nation?: string;
  slug?: string;
  city?: string;
}

export interface MenuInterface {
  id: string;
  name: string;
  dishCount?: number;
}

export interface DishInterface {
  id: string;
  name: string;
  course: string;
  listOrder?: number;
  chefId: string;
  menus?: { id: string; name: string }[];
}

export interface PhotoInterface {
  id: string;
  imageUrl: string;
  filename: string;
}

export interface FactInterface {
  id: string;
  short: string;
  long: string;
}

export interface ReviewInterface {
  id: string;
  rating: number;
  text: string;
  userName: string;
  createdAt: string;
}

export default function ChefDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [chef, setChef] = useState<ChefComplete | undefined>();

  const [menus, setMenus] = useState<MenuInterface[]>([]);
  const [dishes, setDishes] = useState<DishInterface[]>([]);
  const [photos, setPhotos] = useState<PhotoInterface[]>([]);
  const [facts, setFacts] = useState<FactInterface[]>([]);
  const [reviews, setReviews] = useState<ReviewInterface[]>([]);
  const [chefId, setChefId] = useState("");
  const router = useRouter();
  const params = useParams<{ chefId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const res = await axiosIstance.get(`/chefs/${params.chefId}`);
        const data = res.data;

        setChefId(params.chefId);

        setChef(data);
        console.log(data);
        if (data.Menus) {
          setMenus(data.Menus);
        }
        if (data.Dishes) {
          setDishes(data.Dishes);
        }

        setPhotos(data.Photos || []);

        setFacts(data.Facts || []);

        if (data.Review) {
          const formattedReviews = data.Review.map((review: any) => ({
            id: review.id,
            rating: review.rating,
            text: review.text,
            createdAt: new Date(review.createdAt).toLocaleDateString("it-IT"),
          }));
          setReviews(formattedReviews);
        }
      } catch (err) {
        console.error("Errore nel caricamento dei dati dello chef:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [chefId]);

  const handleUpdateChef = async (updatedChef: ChefComplete) => {
    try {
      const res = await axiosIstance.patch(`/chefs/${chefId}`, updatedChef);
      setChef(res.data);
    } catch (error) {
      console.error("Errore nell'aggiornamento dello chef:", error);
    }
  };

  const handleUploadPhoto = async (data: any) => {
    try {
      const newPhoto = {
        imageUrl: data.imageUrl,
        id: data.id,
        filename: data.filename,
      };
      setPhotos([...photos, newPhoto]);
    } catch (error) {
      console.error("Errore nel caricamento della foto:", error);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    try {
      setPhotos(photos.filter((photo) => photo.id !== id));
    } catch (error) {
      console.error("Errore nell'eliminazione della foto:", error);
    }
  };

  const handleAddFact = async (fact: Omit<FactInterface, "id">) => {
    try {
      const res = await axiosIstance.post(`/facts`, { ...fact, chefId });
      setFacts([...facts, res.data]);
    } catch (error) {
      console.error("Errore nell'aggiunta del fatto:", error);
    }
  };

  const handleUpdateFact = async (
    id: string,
    updatedFact: Partial<FactInterface>,
  ) => {
    try {
      const res = await axiosIstance.patch(`/facts/${id}`, updatedFact);
      setFacts(
        facts.map((fact) => (fact.id === id ? { ...fact, ...res.data } : fact)),
      );
    } catch (error) {
      console.error("Errore nell'aggiornamento del fatto:", error);
    }
  };

  const handleDeleteFact = async (id: string) => {
    try {
      await axiosIstance.delete(`/facts/${id}`);
      setFacts(facts.filter((fact) => fact.id !== id));
    } catch (error) {
      console.error("Errore nell'eliminazione del fatto:", error);
    }
  };

  const handleAddMenu = async (menu: Omit<MenuInterface, "id">) => {
    try {
      const res = await axiosIstance.post(`/menus`, { ...menu, chefId });
      setMenus([...menus, res.data]);
    } catch (error) {
      console.error("Errore nell'aggiunta del menu:", error);
    }
  };

  const handleUpdateMenu = async (
    id: string,
    updatedMenu: Partial<MenuInterface>,
  ) => {
    try {
      const res = await axiosIstance.patch(`/menus/${id}`, updatedMenu);
      setMenus(
        menus.map((menu) => (menu.id === id ? { ...menu, ...res.data } : menu)),
      );
    } catch (error) {
      console.error("Errore nell'aggiornamento del menu:", error);
    }
  };

  const handleDeleteMenu = async (id: string) => {
    try {
      await axiosIstance.delete(`/menus/${id}`);
      setMenus(menus.filter((menu) => menu.id !== id));
    } catch (error) {
      console.error("Errore nell'eliminazione del menu:", error);
    }
  };

  const handleAddDishToMenu = async (menuId: string, dishId: string) => {
    try {
      await axiosIstance.post(`/menus/${menuId}/dishes/${dishId}`);
      const res = await axiosIstance.get(`/chefs/${chefId}`);
      setDishes(res.data.Dishes || []);
      setMenus(res.data.Menus || []);
    } catch (error) {
      console.error("Errore nell'aggiunta del piatto al menu:", error);
    }
  };

  const handleRemoveDishFromMenu = async (menuId: string, dishId: string) => {
    try {
      await axiosIstance.delete(`/menus/${menuId}/dishes/${dishId}`);
      const res = await axiosIstance.get(`/chefs/${chefId}`);
      setDishes(res.data.Dishes || []);
      setMenus(res.data.Menus || []);
    } catch (error) {
      console.error("Errore nella rimozione del piatto dal menu:", error);
    }
  };

  const handleReorderDishes = async (
    menuId: string,
    reorderedDishes: DishInterface[],
  ) => {
    try {
      const updates = reorderedDishes.map((dish, index) => ({
        id: dish.id,
        listOrder: index,
      }));

      await axiosIstance.patch(`/menus/${menuId}/reorder`, { dishes: updates });
      setDishes(
        dishes.map((dish) => {
          const update = updates.find((u) => u.id === dish.id);
          return update ? { ...dish, listOrder: update.listOrder } : dish;
        }),
      );
    } catch (error) {
      console.error("Errore nel riordino dei piatti:", error);
    }
  };

  const handleAddDish = async (dish: Omit<DishInterface, "id">) => {
    try {
      const res = await axiosIstance.post(`/dishes`, { ...dish, chefId });
      setDishes([...dishes, res.data]);
    } catch (error) {
      console.error("Errore nell'aggiunta del piatto:", error);
    }
  };

  const handleUpdateDish = async (
    id: string,
    updatedDish: Partial<DishInterface>,
  ) => {
    try {
      const res = await axiosIstance.patch(`/dishes/${id}`, updatedDish);
      setDishes(
        dishes.map((dish) =>
          dish.id === id ? { ...dish, ...res.data } : dish,
        ),
      );
    } catch (error) {
      console.error("Errore nell'aggiornamento del piatto:", error);
    }
  };

  const handleDeleteDish = async (id: string) => {
    try {
      await axiosIstance.delete(`/dishes/${id}`);
      setDishes(dishes.filter((dish) => dish.id !== id));
    } catch (error) {
      console.error("Errore nell'eliminazione del piatto:", error);
    }
  };

  const tabs = [
    { id: "profile", label: "Profilo", icon: User },
    { id: "menus", label: "Menu", icon: MenuIcon },
    { id: "dishes", label: "Piatti", icon: Utensils },
    { id: "photos", label: "Foto", icon: Image },
    { id: "facts", label: "Fatti", icon: ChefHat },
    { id: "reviews", label: "Recensioni", icon: Star },
    { id: "messages", label: "Messaggi", icon: MessageSquare },
  ];

  const handleLogOut = async () => {
    await axiosIstance.post("/api/logout");
    router.push("/chef/chef-registration");
  };

  const handleNavigateToPage = async () => {
    const url = `${chef?.id}-${chef?.slug}`;
    router.push(`/chef/${url}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white">
        Caricamento dashboard...
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white">
        Errore: impossibile caricare i dati dello chef.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#232323]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-3 overflow-x-auto">
            <button
              onClick={() => {
                handleNavigateToPage();
              }}
              className="bg-gold hover:bg-second-theme my-auto rounded-md px-3 py-2 text-white/70 duration-200 hover:cursor-pointer"
            >
              Vai alla tua pagina
            </button>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? "border-b-2 border-[#c8a36a] text-[#c8a36a]"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
            <div className=""></div>
            <button
              onClick={() => {
                handleLogOut();
              }}
              className="bg-gold hover:bg-second-theme my-auto rounded-md px-3 py-2 text-white/70 duration-200 hover:cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {activeTab === "profile" && (
          <ProfileComponent chef={chef} onUpdate={handleUpdateChef} />
        )}

        {activeTab === "menus" && (
          <MenuComponent
            chef={chef}
            menus={menus}
            dishes={dishes}
            onAddDishToMenu={handleAddDishToMenu}
            onUpdateMenu={handleUpdateMenu}
            onAddMenu={handleAddMenu}
            onDeleteMenu={handleDeleteMenu}
            onRemoveDishFromMenu={handleRemoveDishFromMenu}
            onReorderDishes={handleReorderDishes}
          />
        )}
        {activeTab === "dishes" && (
          <DishesComponent
            chef={chef}
            dishes={dishes}
            menus={menus}
            onAdd={handleAddDish}
            onUpdate={handleUpdateDish}
            onDelete={handleDeleteDish}
          />
        )}
        {activeTab === "photos" && (
          <PhotosComponent
            chef={chef}
            photos={photos}
            onUpload={handleUploadPhoto}
            onDelete={handleDeletePhoto}
          />
        )}
        {activeTab === "facts" && (
          <FactsComponent
            chef={chef}
            facts={facts}
            onAdd={handleAddFact}
            onUpdate={handleUpdateFact}
            onDelete={handleDeleteFact}
          />
        )}
        {activeTab === "reviews" && (
          <ReviewComponent chef={chef} reviews={reviews} />
        )}
        {activeTab === "messages" && <MessagesComponent />}
      </main>
    </div>
  );
}
