import { Metadata } from "next";

interface SeoHeadProps {
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[];
  structuredData?: () => void;
  imageUrl?: string | null;
  url?: string;
}

export function generateSeoMetadata({
  seoTitle,
  seoDescription,
  seoKeywords,
  imageUrl,
  url,
}: SeoHeadProps): Metadata {
  const title = seoTitle || "Chef - Trova il tuo Chef Privato";
  const description =
    seoDescription ||
    "Piattaforma per prenotare chef privati a domicilio. Cucina personalizzata, ingredienti freschi, esperienza gourmet.";
  const keywords =
    seoKeywords?.join(", ") ||
    "chef privato, cuoco a domicilio, catering privato";
  const image = imageUrl || "/images/default-og-image.png";
  const currentUrl = url || "https://yourapp.com";

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Chef Platform" }],
    openGraph: {
      title,
      description,
      url: currentUrl,
      siteName: "Chef",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "it_IT",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function StructuredData({ data }: { data: Record<string, unknown> | unknown[] | string | number | boolean | null }) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default generateSeoMetadata;
