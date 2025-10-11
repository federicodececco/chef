import { Photo } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

interface GalleryComponentInterface {
  photos: Photo[];
}

export default function GalleryComponent({
  photos,
}: GalleryComponentInterface) {
  const [visibleCount, setVisibleCount] = useState(8);

  const filteredPhotos = photos.filter((photo) =>
    photo.path.startsWith("images/"),
  );
  const visiblePhotos = filteredPhotos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPhotos.length;
  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:mx-auto md:grid-cols-4 lg:max-w-4xl 2xl:max-w-7xl">
        {[0, 1, 2, 3].map((colIndex) => (
          <div key={colIndex} className="flex flex-col gap-4">
            {visiblePhotos
              .filter((_, index) => index % 4 === colIndex)
              .map((photo) => {
                const seed = photo.id
                  .split("")
                  .reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const randomHeight = (seed % 200) + 250;

                return (
                  <div
                    key={photo.id}
                    className="relative w-full overflow-hidden rounded-lg"
                    style={{ height: `${randomHeight}px` }}
                  >
                    <Image
                      fill
                      className="rounded-lg object-cover"
                      src={photo.imageUrl}
                      alt=""
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j"
                    />
                  </div>
                );
              })}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className="font-medium text-[#c8a36a] underline transition-colors hover:cursor-pointer"
          >
            Carica altre foto
          </button>
        </div>
      )}
    </>
  );
}
