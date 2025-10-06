import ChefCarousel from "@/components/ChefCarousel";
import CitySlider from "@/components/CitySlider";
import ChefsShowcaseSection from "@/components/registration/ChefShowcaseSection";
import DescriptionSection from "@/components/registration/DescriptionSection";
import GlobalLeaderSection from "@/components/registration/GlobalLeaderSection";
import SupportSection from "@/components/registration/SupportSection";
import TakeControlSection from "@/components/registration/TakeControlSection";
import ChefHeader from "@/components/registration/ChefHeader";
import FaqComponentWrapper from "@/components/registration/FaqComponentWrapper";

export const revalidate = 3600;

export default function ChefRegistration() {
  return (
    <div className="-z-4 bg-[#232323] md:bg-[#0A0A0A]">
      <ChefHeader />

      <DescriptionSection />

      <GlobalLeaderSection />

      <div className="hidden w-full py-10 lg:block">
        <CitySlider />
      </div>

      <TakeControlSection />

      <ChefsShowcaseSection />

      <SupportSection />

      <FaqComponentWrapper />
    </div>
  );
}
