export default function ChefRegistration() {
  return (
    <>
      <header className="relative h-[500]">
        {/* image container */}
        <div className="relative -z-10 mt-18 h-full bg-[url('/registration/header-chef-mobile.webp')] bg-cover bg-no-repeat md:bg-[url('/registration/header-chef.webp')] md:bg-auto">
          <div className="absolute inset-0 -z-10 bg-black/40" />
          <div className="absolute top-[50%] left-[50%] w-lg -translate-[50%] text-center md:w-3xl">
            <h1 className="text-lg font-semibold text-white md:text-3xl">
              Fare ciò che si ama
            </h1>
            <button className="mt-8 rounded-4xl bg-[#F4C858] px-6 py-3 text-sm font-semibold md:px-8 md:py-3">
              Diventa uno dei nostri chef
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 h-18 w-full rounded-t-3xl bg-red-500"></div>
      </header>
      {/* description section */}
      <section>
        <div className="w-full"></div>
      </section>
    </>
  );
}
