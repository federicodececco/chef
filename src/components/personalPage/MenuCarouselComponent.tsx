import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Menu, Dish } from "@prisma/client";

interface MenuWithDishes {
  id: string;
  chefId: string;
  name: string;
  maxPeople: number | null;
  price: number | undefined;
  created_at: Date;
  Dishes: Dish[];
}

interface MenuCarouselComponentInterface {
  menus: MenuWithDishes[];
}

export default function MenuCarouselComponent({
  menus,
}: MenuCarouselComponentInterface) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedMenu, setSelectedMenu] = useState<MenuWithDishes | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % menus.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + menus.length) % menus.length);
  };

  const openMenuModal = (menu: MenuWithDishes) => {
    setSelectedMenu(menu);
  };

  const closeMenuModal = () => {
    setSelectedMenu(null);
  };

  const getDishesByCourse = (menu: MenuWithDishes, course: string) => {
    return menu.Dishes.filter(
      (item) => item.course.toLowerCase() === course.toLowerCase(),
    ).sort((a, b) => (a.listOrder || 0) - (b.listOrder || 0));
  };

  return (
    <>
      <div className="mx-auto flex items-center justify-center p-4 lg:max-w-4xl 2xl:max-w-7xl">
        <div className="relative w-full max-w-7xl">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute right-20 bottom-0 z-20 -translate-y-1/2 rounded-full bg-[#0A0A0A] p-3 shadow-lg outline outline-[#c8a36a] transition-colors hover:bg-[#c8a36a] md:right-2/2 md:bottom-1/2"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-[#c8a36a]" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 bottom-0 z-20 -translate-y-1/2 rounded-full bg-[#0A0A0A] p-3 shadow-lg outline outline-[#c8a36a] transition-colors hover:bg-[#c8a36a] md:right-14 md:bottom-1/2"
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
                        {getDishesByCourse(menu, "antipasto").map(
                          (item, idx) => (
                            <p
                              key={idx}
                              className="leading-relaxed text-white/70"
                            >
                              {item.name}
                            </p>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="border-l-4 border-[#c8a36a] pl-4">
                        <h3 className="text-lg font-semibold tracking-wide text-white/70 uppercase">
                          Primi
                        </h3>
                        <div className="mt-1 text-base font-medium text-white/80">
                          {getDishesByCourse(menu, "primo").map((item, idx) => (
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
                        {getDishesByCourse(menu, "secondo").map((item, idx) => (
                          <p
                            key={idx}
                            className="leading-relaxed text-white/70"
                          >
                            {item.name}
                          </p>
                        ))}
                      </div>
                    </div>

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
                        {getDishesByCourse(menu, "dolce").map((item, idx) => (
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
                  <div className="mt-8 border-t border-[#c8a36a] pt-6 text-center">
                    <button
                      onClick={() => openMenuModal(menu)}
                      className="font-medium text-[#c8a36a] underline transition-colors hover:text-[#d4b480]"
                    >
                      Vedi il menu completo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {menus.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index
                    ? "w-8 bg-[#c8a36a]"
                    : "w-2 bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal Menu Completo */}
      {selectedMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#c8a36a] bg-[#0A0A0A] p-8 shadow-2xl md:p-12">
            {/* Close Button */}
            <button
              onClick={closeMenuModal}
              className="absolute top-4 right-4 rounded-full bg-[#232323] p-2 text-[#c8a36a] transition-colors hover:bg-[#c8a36a] hover:text-[#0A0A0A]"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-gold">Per Persona € {selectedMenu.price}</h2>

            {/* Menu Title */}
            <h2 className="mb-8 text-4xl font-bold text-[#c8a36a] md:text-5xl">
              {selectedMenu.name}
            </h2>

            {/* Antipasti */}
            {getDishesByCourse(selectedMenu, "antipasto").length > 0 && (
              <div className="mb-10">
                <div className="mb-4 border-l-4 border-[#c8a36a] pl-4">
                  <h3 className="text-2xl font-semibold tracking-wide text-white uppercase">
                    Antipasti
                  </h3>
                </div>
                <div className="space-y-3 pl-4">
                  {getDishesByCourse(selectedMenu, "antipasto").map(
                    (item, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-[#232323] p-4 transition-colors hover:bg-[#2a2a2a]"
                      >
                        <p className="text-lg leading-relaxed text-white">
                          {item.name}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Primi */}
            {getDishesByCourse(selectedMenu, "primo").length > 0 && (
              <div className="mb-10">
                <div className="mb-4 border-l-4 border-[#c8a36a] pl-4">
                  <h3 className="text-2xl font-semibold tracking-wide text-white uppercase">
                    Primi
                  </h3>
                </div>
                <div className="space-y-3 pl-4">
                  {getDishesByCourse(selectedMenu, "primo").map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg bg-[#232323] p-4 transition-colors hover:bg-[#2a2a2a]"
                    >
                      <p className="text-lg leading-relaxed text-white">
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Secondi */}
            {getDishesByCourse(selectedMenu, "secondo").length > 0 && (
              <div className="mb-10">
                <div className="mb-4 border-l-4 border-[#c8a36a] pl-4">
                  <h3 className="text-2xl font-semibold tracking-wide text-white uppercase">
                    Secondi
                  </h3>
                </div>
                <div className="space-y-3 pl-4">
                  {getDishesByCourse(selectedMenu, "secondo").map(
                    (item, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-[#232323] p-4 transition-colors hover:bg-[#2a2a2a]"
                      >
                        <p className="text-lg leading-relaxed text-white">
                          {item.name}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Contorni */}
            {getDishesByCourse(selectedMenu, "contorno").length > 0 && (
              <div className="mb-10">
                <div className="mb-4 border-l-4 border-[#c8a36a] pl-4">
                  <h3 className="text-2xl font-semibold tracking-wide text-white uppercase">
                    Contorni
                  </h3>
                </div>
                <div className="space-y-3 pl-4">
                  {getDishesByCourse(selectedMenu, "contorno").map(
                    (item, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-[#232323] p-4 transition-colors hover:bg-[#2a2a2a]"
                      >
                        <p className="text-lg leading-relaxed text-white">
                          {item.name}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Dolci */}
            {getDishesByCourse(selectedMenu, "dolce").length > 0 && (
              <div className="mb-6">
                <div className="mb-4 border-l-4 border-[#c8a36a] pl-4">
                  <h3 className="text-2xl font-semibold tracking-wide text-white uppercase">
                    Dolci
                  </h3>
                </div>
                <div className="space-y-3 pl-4">
                  {getDishesByCourse(selectedMenu, "dolce").map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg bg-[#232323] p-4 transition-colors hover:bg-[#2a2a2a]"
                    >
                      <p className="text-lg leading-relaxed text-white">
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info aggiuntive */}
            {selectedMenu.maxPeople && (
              <div className="mt-8 border-t border-[#c8a36a]/30 pt-6">
                <p className="text-center text-white/70">
                  Questo menu è disponibile per un massimo di{" "}
                  <span className="font-semibold text-[#c8a36a]">
                    {selectedMenu.maxPeople} persone
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
