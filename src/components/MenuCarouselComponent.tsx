import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Menu } from "@prisma/client";

interface MenuCarouselComponentInterface {
  menus: Menu[];
}

export default function MenuCarouselComponent({
  menus,
}: MenuCarouselComponentInterface) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % menus.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + menus.length) % menus.length);
  };

  return (
    <div className="mx-auto flex items-center justify-center p-4 lg:max-w-4xl 2xl:max-w-7xl">
      <div className="relative w-full max-w-7xl">
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="top-1/2 -left-10 z-20 hidden -translate-y-1/2 rounded-full bg-[#0A0A0A] p-3 shadow-lg outline outline-[#c8a36a] transition-colors hover:bg-[#c8a36a] md:absolute md:block"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 text-[#c8a36a]" />
        </button>

        <button
          onClick={nextSlide}
          className="top-1/2 right-14 z-20 hidden -translate-y-1/2 rounded-full bg-[#0A0A0A] p-3 shadow-lg outline outline-[#c8a36a] transition-colors hover:bg-[#c8a36a] md:absolute md:block"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 text-amber-600" />
        </button>

        {/* Carousel Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(calc(-${currentSlide * 70}% - ${currentSlide}rem))`,
            }}
          >
            {menus.map((menu, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-4 text-white/70"
                style={{ width: "70%" }}
              >
                <div
                  className={`max-h-100 overflow-hidden rounded-2xl border-1 border-[#c8a36a] bg-[#0A0A0A] p-8 shadow-xl transition-all duration-300 md:p-12 ${
                    index === currentSlide
                      ? "scale-100 opacity-100"
                      : "scale-95 opacity-60"
                  }`}
                >
                  {/* Menu Title */}
                  <h2 className="mb-8 text-3xl font-bold text-[#c8a36a] md:text-4xl">
                    {menu.name}
                  </h2>

                  {/* antipasto section*/}
                  <div className="mb-8">
                    <div className="mb-4 border-l-4 border-[#c8a36a] pl-4">
                      <h3 className="text-lg font-semibold tracking-wide text-white/70 uppercase">
                        antipasti
                      </h3>
                      <p className="mt-1 text-base font-medium text-white/80">
                        scegli due piatti
                      </p>
                    </div>
                    <div className="space-y-2 pl-4">
                      {menu.Dishes.filter((item) => item.course === "antipasto")
                        .sort((a, b) => a.order - b.order)
                        .map((item, idx) => (
                          <p
                            key={idx}
                            className="leading-relaxed text-white/70"
                          >
                            {item.name}
                          </p>
                        ))}
                    </div>
                  </div>

                  {/* Primo Section */}
                  <div className="mb-8">
                    <div className="border-l-4 border-[#c8a36a] pl-4">
                      <h3 className="text-lg font-semibold tracking-wide text-white/70 uppercase">
                        Primi
                      </h3>
                      <div className="mt-1 text-base font-medium text-white/80">
                        {menu.Dishes.filter((item) => item.course === "primo")
                          .sort((a, b) => a.order - b.order)
                          .map((item, idx) => (
                            <p
                              key={idx}
                              className="leading-relaxed text-white/70"
                            >
                              {item.name}
                            </p>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Piatto Principale Section */}
                  <div className="mb-6">
                    <div className="mb-4 border-l-4 border-[#c8a36a] pl-4">
                      <h3 className="text-lg font-semibold tracking-wide text-white/70 uppercase">
                        Secondi
                      </h3>
                      <p className="mt-1 text-base font-medium text-white/80">
                        Scegli due piatti
                      </p>
                    </div>
                    <div className="space-y-2 pl-4">
                      {menu.Dishes.filter((item) => item.course === "secondo")
                        .sort((a, b) => a.order - b.order)
                        .map((item, idx) => (
                          <p
                            key={idx}
                            className="leading-relaxed text-white/70"
                          >
                            {item.name}
                          </p>
                        ))}
                    </div>
                  </div>
                  {/* Dolce Section */}
                  <div className="mb-6">
                    <div className="mb-4 border-l-4 border-[#c8a36a] pl-4">
                      <h3 className="text-lg font-semibold tracking-wide text-white/70 uppercase">
                        Dolce
                      </h3>
                      <p className="mt-1 text-base font-medium text-white/80">
                        Scegli due piatti
                      </p>
                    </div>
                    <div className="space-y-2 pl-4">
                      {menu.Dishes.filter((item) => item.course === "dolce")
                        .sort((a, b) => a.order - b.order)
                        .map((item, idx) => (
                          <p
                            key={idx}
                            className="leading-relaxed text-white/70"
                          >
                            {item.name}
                          </p>
                        ))}
                    </div>
                  </div>

                  {/* View Complete Menu Link */}
                </div>
                <div className="mt-8 border-t border-[#c8a36a] pt-6 text-center">
                  <a
                    href="#"
                    className="font-medium text-[#c8a36a] underline transition-colors"
                  >
                    Vedi il menu completo
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="mt-6 flex justify-center gap-2">
          {menus.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === index ? "w-8 bg-[#c8a36a]" : "w-2 bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
