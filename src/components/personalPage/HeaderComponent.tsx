import Image from "next/image";

interface HeaderComponentInterface {
  handleToggle?: () => void;
  mainText: string;
  subText?: string;
  imageUrl: string | null;
}

export default function HeaderComponent({
  handleToggle,
  mainText,
  subText,
  imageUrl,
}: HeaderComponentInterface) {
  return (
    <header className="relative h-[500] w-full">
      {/* image container */}

      <div className="relative z-10 h-full">
        <div className="relative h-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Header image"
              fill
              className="object-cover object-top"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-800">
              <p className="text-white">Nessuna immagine disponibile</p>
            </div>
          )}
        </div>
        <div className="absolute inset-0 z-0 bg-black/50" />
        <div className="absolute top-[50%] left-[50%] -translate-[50%] text-center md:w-xl">
          <h1 className="text-lg font-semibold text-[#c8a36a] md:text-3xl">
            {mainText}
          </h1>
          {subText && (
            <h2 className="text-lg font-semibold text-[#c8a36a] md:text-3xl">
              {subText}
            </h2>
          )}
          {handleToggle && (
            <button
              className="z-20 mt-8 rounded-4xl bg-[#c8a36a] px-6 py-3 text-sm font-semibold md:px-8 md:py-3"
              onClick={handleToggle}
            >
              {subText}
            </button>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 z-20 w-full md:px-4">
        <div className="z-20 mx-auto h-14 rounded-t-3xl bg-[#232323] lg:max-w-4xl 2xl:max-w-7xl"></div>
      </div>
    </header>
  );
}
