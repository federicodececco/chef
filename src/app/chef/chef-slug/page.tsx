import Image from "next/image";
import headerImage from "../../../../public/chef/header-image.jpg";
const MockChef = {
  id: "idchef",
  bio: "",
  avatarUrl: "",
  phoneNumber: "",
  nation: "",
  slug: "",
};

export default function ChefPersonalPage() {
  return (
    <>
      <header className="relative h-[500] w-full">
        {/* image container */}

        <div className="relative z-10 mt-18 h-full bg-cover bg-center">
          <div className="relative h-full">
            <Image
              src={headerImage}
              alt="Header image"
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j"
            />
          </div>
          <div className="absolute inset-0 -z-5 bg-black/40" />
          <div className="absolute top-[50%] left-[50%] -translate-[50%] text-center md:w-xl">
            <h1 className="text-lg font-semibold text-white md:text-3xl">
              Fare ciò che si ama
            </h1>
          </div>
        </div>
        <div className="absolute bottom-0 z-20 w-full md:px-4">
          <div className="z-20 mx-auto h-14 rounded-t-3xl bg-[#232323] lg:max-w-4xl 2xl:max-w-7xl"></div>
        </div>
      </header>
      <section></section>
    </>
  );
}
