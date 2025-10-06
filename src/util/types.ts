import { Prisma, Chef, User, Menu, Photo, Review, Facts } from "@prisma/client";

export type ChefComplete = Chef & {
  user: User | null;
  Menus: Menu[];
  Photos: Photo[];
  Review: Review[];
  Facts: Facts[];
};
