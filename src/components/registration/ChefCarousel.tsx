import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Slide {
  id: string;
  avatarUrl: string;
  user: {
    firstname: string;
    lastname: string;
  };
  chefSlug: string;
}

export default function ChefCarousel() {
  const router = useRouter();

  const handleNavigation = (id: string, chefSlug: string) => {
    const url = `/chef/${id}-${chefSlug}`;
    router.push(url);
  };

  const [actualSlides, setActualSlides] = useState<Slide[]>();
  useEffect(() => {
    const slides: Slide[] = [
      {
        id: "1",
        avatarUrl: "/registration/placeholder.png",
        user: {
          firstname: "chef",
          lastname: "1",
        },
        chefSlug: "1/chef",
      },
      {
        id: "2",
        avatarUrl: "/registration/placeholder.png",
        user: {
          firstname: "chef",
          lastname: "2",
        },
        chefSlug: "2/chef",
      },
      {
        id: "3",
        avatarUrl: "/registration/placeholder.png",
        user: {
          firstname: "chef",
          lastname: "3",
        },
        chefSlug: "3/chef",
      },
    ];

    const fetchChef = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/chefs");
        const data = await res.json();
        if (data) {
          setActualSlides(data);
        } else setActualSlides(slides);
      } catch (error) {
        console.error(error);
      }
    };
    fetchChef();
  }, []);

  return (
    <div className="mx-auto w-full">
      <div className="relative max-w-6xl">
        <div className="carousel carousel-center bg-neutral rounded-box relative mx-auto w-full space-x-4 p-4">
          {actualSlides &&
            actualSlides
              .filter(
                (slide) => slide.avatarUrl && slide.avatarUrl.trim() !== "",
              )
              .map((slide) => (
                <div
                  onClick={() => {
                    handleNavigation(slide.id, slide.chefSlug);
                  }}
                  key={slide.id}
                  className={`carousel-item relative z-10 flex justify-center text-5xl font-bold text-white hover:animate-pulse hover:cursor-pointer`}
                >
                  <Image
                    src={slide.avatarUrl}
                    width={300}
                    height={500}
                    alt={`${slide.user.firstname} ${slide.user.lastname}`}
                    className="rounded-box cover z-2 object-cover"
                  />
                  <div className="absolute inset-0 z-5 bg-black/50"></div>
                  <h2 className="text-gold absolute z-10 text-center text-5xl font-bold">
                    {`${slide.user.firstname} ${slide.user.lastname}`}
                  </h2>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
