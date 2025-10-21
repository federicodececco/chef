import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Cache Prisma client in both development and production to avoid connection pool exhaustion
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}
