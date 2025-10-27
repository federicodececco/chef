import { NextRequest, NextResponse } from "next/server";
import { generateChefSeo, ChefSeoInput } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { chefId } = await req.json();

    if (!chefId) {
      return NextResponse.json(
        { error: "chefId è richiesto" },
        { status: 400 },
      );
    }

    /* get chef data */
    const chef = await prisma.chef.findUnique({
      where: { id: chefId },
      include: {
        user: true,
        Menus: true,
        Dishes: {
          include: {
            categories: true,
          },
        },
        Review: true,
      },
    });

    if (!chef) {
      return NextResponse.json({ error: "Chef non trovato" }, { status: 404 });
    }
    /* get specialities */
    const specialties = [
      ...new Set(
        chef.Dishes.flatMap((dish) => dish.categories.map((cat) => cat.name)),
      ),
    ];

    /* rating calc */
    const avgRating =
      chef.Review.length > 0
        ? chef.Review.reduce((sum, r) => sum + r.rating, 0) / chef.Review.length
        : undefined;

    /* price range */
    const avgPrice =
      chef.Menus.length > 0
        ? chef.Menus.reduce((sum, m) => sum + (m.price || 0), 0) /
          chef.Menus.length
        : 0;

    let priceRange = "€€";
    if (avgPrice < 30) priceRange = "€";
    else if (avgPrice > 60) priceRange = "€€€";

    /* get gemini input ready */
    const seoInput: ChefSeoInput = {
      chefName: `${chef.user.firstname} ${chef.user.lastname}`,
      bio: chef.bio,
      bioBrief: chef.bioBrief,
      city: chef.city,
      nation: chef.nation,
      specialties: specialties.length > 0 ? specialties : ["Cucina italiana"],
      rating: avgRating ? Math.round(avgRating * 10) / 10 : undefined,
      reviewCount: chef.Review.length,
      menuTypes: chef.Menus.map((m) => m.name),
      priceRange,
    };

    /* generate seo data */
    const seoData = await generateChefSeo(seoInput);

    /* update database with seo */
    const updatedChef = await prisma.chef.update({
      where: { id: chefId },
      data: {
        seoTitle: seoData.seoTitle,
        seoDescription: seoData.seoDescription,
        seoKeywords: seoData.seoKeywords,
        structuredData: seoData.structuredData,
        seoUpdatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "SEO generato e salvato con successo",
      data: {
        seoTitle: updatedChef.seoTitle,
        seoDescription: updatedChef.seoDescription,
        seoKeywords: updatedChef.seoKeywords,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Errore durante la generazione SEO",
      },
      { status: 500 },
    );
  }
}
