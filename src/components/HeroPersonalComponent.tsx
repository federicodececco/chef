import Image from "next/image";

interface HeroPersonalComponentInterface {
  imageUrl: any | string;
}

export default function HeroPersonalComponent({
  imageUrl,
}: HeroPersonalComponentInterface) {
  return (
    <div className="mx-auto bg-[#232323] lg:max-w-4xl 2xl:max-w-7xl">
      <div className="grid grid-cols-1 p-5 px-10 md:grid-cols-3">
        <div className="col-span-1">
          <h1 className="text-4xl">Conoscimi meglio</h1>
          <h2>Laboratorio di cucina tradizionale italiana e pasta fresca</h2>
        </div>
        <div className="col-span-1">
          Nata e cresciuta a Firenze, mi sono trasferita in Spagna a 17 anni, ma
          è stato solo nel 2009, dopo essermi trasferita a Londra, che ho
          iniziato e scoperto la mia passione per la cucina grazie al mio
          mentore Paul, che mi ha fatto rivivere i sapori nostalgici della mia
          infanzia.
        </div>
        <div className="col-span-1 max-w-full">
          <div className="relative aspect-square">
            <Image
              src={imageUrl}
              alt="Header image"
              fill
              className="rounded-2xl object-cover"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
