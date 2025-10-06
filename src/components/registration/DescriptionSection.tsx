import BeYourOwnBoss from "./BeYourOwnBoss";
import BuildConnections from "./BuildConnections";
import CookYourCreations from "./CookYourCreations";

export const revalidate = 3600;

export default function DescriptionSection() {
  return (
    <section className="w-full pb-40 md:px-4">
      <div className="mx-auto rounded-b-3xl bg-[#232323] lg:max-w-4xl 2xl:max-w-7xl">
        <BeYourOwnBoss />

        <div className="pt-20">
          <CookYourCreations />
        </div>

        <div className="relative -bottom-15 pt-20">
          <BuildConnections />
        </div>
      </div>
    </section>
  );
}
