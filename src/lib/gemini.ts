const apiKey = process.env.NEXT_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY non trovata nelle variabili d'ambiente. Aggiungi GEMINI_API_KEY al tuo file .env",
  );
}

/* gemini model */
export const modelName = "gemini-2.5-flash";

/* interface to insert cefh datas */
export interface ChefSeoInput {
  chefName: string;
  bio?: string | null;
  bioBrief?: string | null;
  city?: string | null;
  nation?: string | null;
  specialties: string[];
  rating?: number;
  reviewCount: number;
  menuTypes: string[];
  priceRange?: string;
}

/* interface to get output chef seo datas */
export interface SeoOutput {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  structuredData: {
    "@context": string;
    "@type": string;
    name: string;
    description: string;
    image?: string;
    address?: {
      "@type": string;
      addressLocality?: string;
      addressCountry?: string;
    };
    aggregateRating?: {
      "@type": string;
      ratingValue: number;
      reviewCount: number;
    };
    priceRange?: string;
  };
}

/* function to generate seo, to input into LLMs */
export async function generateChefSeo(input: ChefSeoInput): Promise<SeoOutput> {
  const prompt = `
Sei un esperto SEO specializzato in ottimizzazione per ristoranti e chef.
Genera dati SEO ottimizzati per un profilo di chef privato/a domicilio.

DATI CHEF:
- Nome: ${input.chefName}
- Bio: ${input.bio || "Non fornita"}
- Bio Breve: ${input.bioBrief || "Non fornita"}
- Città: ${input.city || "Non specificata"}
- Nazione: ${input.nation || "Italia"}
- Specialità: ${input.specialties.join(", ") || "Cucina italiana"}
- Rating: ${input.rating ? `${input.rating}/5` : "Non ancora recensito"}
- Numero recensioni: ${input.reviewCount}
- Tipi di menu: ${input.menuTypes.join(", ") || "Vari"}
- Fascia di prezzo: ${input.priceRange || "€€"}

ISTRUZIONI:
1. **SEO Title** (massimo 60 caratteri):
   - Includi nome chef, specialità principale, città
   - Ottimizzato per ricerche locali tipo "chef privato [città]"
   - Esempio: "Chef Marco Rossi - Cucina Italiana a Milano | Chef Privato"

2. **SEO Description** (massimo 160 caratteri):
   - Descrizione accattivante e informativa
   - Includi call-to-action, rating se disponibile, specialità
   - Esempio: "Chef privato specializzato in cucina tradizionale italiana. Menu personalizzati, ingredienti freschi. Disponibile a Milano. ⭐ 4.8/5"

3. **SEO Keywords** (array di 8-12 keywords):
   - Keywords long-tail ottimizzate per ricerca locale
   - Esempi: ["chef privato milano", "cuoco a domicilio", "catering privato", "cucina italiana milano"]

4. **Structured Data JSON-LD** (Schema.org Person + LocalBusiness):
   - Tipo: Person + LocalBusiness
   - Includi aggregateRating se ci sono recensioni
   - Indirizzo con città e nazione
   - Fascia prezzo

FORMATO OUTPUT (rispondi SOLO con JSON valido, senza markdown):
{
  "seoTitle": "...",
  "seoDescription": "...",
  "seoKeywords": ["...", "..."],
  "structuredData": {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "...",
    "description": "...",
    "jobTitle": "Chef Privato",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "...",
      "addressCountry": "..."
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ...,
      "reviewCount": ...
    },
    "priceRange": "..."
  }
}
`;

  try {
    /* call to gemini API */
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error(
        `Risposta API non valida o incompleta. FinishReason: ${data.candidates?.[0]?.finishReason || "unknown"}`,
      );
    }

    const text = data.candidates[0].content.parts[0].text;

    const jsonText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const seoData: SeoOutput = JSON.parse(jsonText);

    /*validation */
    if (seoData.seoTitle.length > 60) {
      seoData.seoTitle = seoData.seoTitle.substring(0, 57) + "...";
    }
    if (seoData.seoDescription.length > 160) {
      seoData.seoDescription = seoData.seoDescription.substring(0, 157) + "...";
    }

    return seoData;
  } catch (error) {
    throw new Error("Can't generate seo, try again later");
  }
}
