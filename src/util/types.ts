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
