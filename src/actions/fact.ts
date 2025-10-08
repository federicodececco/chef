"use server";

import { prisma } from "@/lib/prisma";

export async function createFact(data: {
  short: string;
  long: string;
  chefId: string;
}) {
  try {
    const fact = await prisma.facts.create({
      data: {
        short: data.short,
        long: data.long,
        chefId: data.chefId,
      },
      include: {
        chef: {
          select: {
            id: true,
            slug: true,
          },
        },
      },
    });

    return { success: true, data: fact };
  } catch (error) {
    console.error("Error creating fact:", error);
    return { success: false, error: "Error creating fact" };
  }
}

export async function getChefFacts(chefId: string) {
  try {
    const facts = await prisma.facts.findMany({
      where: {
        chefId: chefId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return { success: true, data: facts };
  } catch (error) {
    console.error("Error fetching facts:", error);
    return { success: false, error: "Error fetching facts" };
  }
}

export async function getFactById(id: string) {
  try {
    const fact = await prisma.facts.findUnique({
      where: { id },
      include: {
        chef: true,
      },
    });

    if (!fact) {
      return { success: false, error: "Fact not found" };
    }

    return { success: true, data: fact };
  } catch (error) {
    console.error("Error fetching fact:", error);
    return { success: false, error: "Error fetching fact" };
  }
}

export async function updateFact(data: {
  id: string;
  short?: string;
  long?: string;
}) {
  try {
    const fact = await prisma.facts.update({
      where: { id: data.id },
      data: {
        ...(data.short && { short: data.short }),
        ...(data.long && { long: data.long }),
      },
      include: {
        chef: {
          select: {
            slug: true,
          },
        },
      },
    });

    return { success: true, data: fact };
  } catch (error) {
    console.error("Error updating fact:", error);
    return { success: false, error: "Error updating fact" };
  }
}

export async function deleteFact(id: string) {
  try {
    const fact = await prisma.facts.findUnique({
      where: { id },
      include: {
        chef: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!fact) {
      return { success: false, error: "Fact not found" };
    }

    await prisma.facts.delete({
      where: { id },
    });

    return { success: true, message: "Fact succesfuly deleted" };
  } catch (error) {
    console.error("Error deleting fact:", error);
    return { success: false, error: "Impossibile eliminare il fact" };
  }
}

/* used to create multiple facts simultaneously */
export async function createMultipleFacts(
  chefId: string,
  facts: Array<{ short: string; long: string }>,
) {
  try {
    const createdFacts = await prisma.facts.createMany({
      data: facts.map((fact) => ({
        short: fact.short,
        long: fact.long,
        chefId: chefId,
      })),
    });

    return { success: true, count: createdFacts.count };
  } catch (error) {
    console.error("Error creating multiple facts:", error);
    return { success: false, error: "Error creating multiple facts" };
  }
}
