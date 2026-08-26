import { Hero } from "@/components/home/Hero";
import { ServiceSlider } from "@/components/home/ServiceSlider";
import { RegistrationCTAs } from "@/components/home/RegistrationCTAs";
import { FeaturesBar } from "@/components/home/FeaturesBar";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: `${SITE.name} | ${SITE.slogan}`,
  description:
    "PetLoog kurumsal web sitesi. Mobil uygulama, veteriner sistemi, pet market ve daha fazlası.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceSlider />
      <RegistrationCTAs />
      <FeaturesBar />
    </>
  );
}
