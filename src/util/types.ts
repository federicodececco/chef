import { Chef, User, Menu, Photo, Review, Facts, Dish } from "@prisma/client";
export type ChefComplete = Chef & {
  user: User | null;
  Menus: MenuWithDishes[];
  Photos: Photo[];
  Review: Review[];
  Facts: Facts[];
  Dishes: Dish[];
};

export type MenuWithDishes = Menu & {
  Dishes: Dish[];
};

export interface CategoryInterface {
  id: string;
  name: string;
  createdAt?: string;
}

export interface DishInterface {
  id: string;
  name: string;
  course: string;
  listOrder?: number;
  chefId: string;
  categories?: CategoryInterface[];
  Menus?: Menu[];
  createdAt?: string;
}
export interface CreateDishInput {
  name: string;
  menuId?: string;
  course: string;
  listOrder: number;
  chefId: string;
  categoryIds: string[];
}
export interface MenuInterface {
  id: string;
  name: string;
  dishCount?: number;
  maxPeople?: number;
  price?: number;
  Dishes?: DishInterface[];
}
