export const revalidate = 3600;

export default function GlobalLeaderSection() {
  return (
    <section className="h-[620px] w-full">
      <div className="relative z-10 mt-18 h-full bg-[url('/registration/chef-man-footer-mobile.webp')] bg-cover md:bg-[url('/registration/chef-man-footer.webp')]">
        <div className="absolute inset-0 -z-5 bg-black/40" />
        <div className="absolute top-[50%] left-[50%] -translate-[50%] text-center md:w-xl">
          <h1 className="text-lg font-semibold text-white md:text-3xl">
            Leader Globali dal 2012
          </h1>
          <button className="z-20 mt-8 rounded-4xl bg-white px-6 py-3 text-sm font-semibold md:px-8 md:py-3">
            Unisciti a noi ora
          </button>
        </div>
      </div>
    </section>
  );
}
