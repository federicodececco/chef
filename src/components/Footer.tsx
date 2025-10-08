import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-first-theme pt-20 text-white/70">
      <div className="border-gold mx-auto max-w-6xl gap-3 border-t-1 border-dashed px-10 pt-4 pb-10 text-center lg:grid lg:grid-cols-4 lg:text-left">
        <div className="col-span-2 flex flex-col gap-10">
          <div className="relative mx-auto min-h-[70px] w-1/2 lg:mx-0">
            <Image
              fill
              className="object-contain"
              src="/registration/logo-oro-COD.png"
              alt="Logo"
            />
          </div>
          <div>
            Authentic italian dining experiences, crafted by selected private
            chefs, in the comfort of your own home for unforgettable dining
            moments.
          </div>
          <button className="mx-auto max-w-40 rounded-xl bg-[#c8a36a] px-8 py-3 text-white lg:mx-0">
            Find a chef
          </button>
        </div>
        <div className="grid-col-span-1 pt-20">
          <h1 className="pb-4">About</h1>
          <ul>
            <li>Join as a chef</li>
            <li>Partners</li>
            <li>Privacy ploicy</li>
            <li>Coockie policy</li>
          </ul>
        </div>
        <div className="grid-col-span-1 pt-10">
          <h1 className="pb-4">Contact us</h1>
          <ul>
            <li>Ask a question</li>
          </ul>
        </div>
      </div>

      <div className="border-second-theme h-40 border-t-1"></div>
    </footer>
  );
}
