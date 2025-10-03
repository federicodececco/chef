export default function CitySlider() {
  const words = [
    "Rome",
    "Paris",
    "London",
    "Berlin",
    "Madrid",
    "Tokyo",
    "New York",
    "Moscow",
    "Beijing",
    "Cairo",
    "Mumbai",
    "São Paulo",
    "Mexico City",
    "Buenos Aires",
    "Sydney",
    "Toronto",
    "Los Angeles",
    "Singapore",
    "Dubai",
    "Istanbul",
  ];

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full">
        <div className="relative w-full overflow-hidden">
          <div className="animate-scroll-right flex gap-12">
            {[...words, ...words].map((word, i) =>
              i % 2 ? (
                <span
                  key={i}
                  className="bg-black bg-clip-text text-6xl font-bold whitespace-nowrap text-transparent"
                >
                  {word}
                </span>
              ) : (
                <span
                  key={i}
                  className="bg-white bg-clip-text text-6xl font-bold whitespace-nowrap text-transparent"
                >
                  {word}
                </span>
              ),
            )}
          </div>
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="animate-scroll-left flex gap-12">
            {[...words, ...words].map((word, i) =>
              i % 2 ? (
                <span
                  key={i}
                  className="bg-black bg-clip-text text-6xl font-bold whitespace-nowrap text-transparent"
                >
                  {word}
                </span>
              ) : (
                <span
                  key={i}
                  className="bg-white bg-clip-text text-6xl font-bold whitespace-nowrap text-transparent"
                >
                  {word}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
