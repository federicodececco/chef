import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ChefCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 1, title: "Chef 1" },
    { id: 2, title: "Chef 2" },
    { id: 3, title: "Chef 3" },
    { id: 4, title: "Chef 4" },
    { id: 5, title: "Chef 5" },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };
  const slideWidth = 320;
  const gap = 16;

  return (
    <div className="w-full overflow-clip px-4">
      <div className="relative mx-auto max-w-6xl">
        <div className="relative overflow-hidden md:overflow-visible">
          <div
            className="flex gap-4 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * (slideWidth + gap)}px)`,
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`flex min-h-100 min-w-80 items-center justify-center rounded-2xl bg-[url('/registration/placeholder.png')] shadow-xl transition-opacity duration-300 ${
                  index !== currentSlide
                    ? "opacity-40 md:opacity-100"
                    : "opacity-100"
                }`}
              >
                <h2 className="text-5xl font-bold text-white">{slide.title}</h2>
              </div>
            ))}
          </div>

          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-all hover:scale-110 hover:bg-white"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>
          )}

          {currentSlide < slides.length - 1 && (
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-all hover:scale-110 hover:bg-white"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
