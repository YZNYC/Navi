import Header from "@/components/shadcn/navbar/page";
import Hero3 from "../components/landingpage/banner/page"
import Navbar04Page from "@/components/shadcn/navbar-04/navbar-04";
import { Footer7 } from "@/components/shadcn/footer/footer-7";
import FeaturesSection from '../components/teste/FeaturesSection';
import ShowcaseSection from '../components/teste/ShowcaseSection';
import SecondaryFeaturesSection from '../components/teste/FeaturesSection2';
import AppShowcaseSection from '../components/teste/AppShowcase';
import CtaFaqSection from '../components/teste/CtaFaqSection';
import VideoShowcaseSection from '../components/teste/VideoShowcaseSection';

export default function Home() {
  return (
    <>
      <section>
        <Header />
      </section>

      <section>
        <Navbar04Page />
      </section>

      <section id="home" className="container mx-auto py-24">
        <Hero3 />
      </section>

      <section>
        <FeaturesSection />
      </section>

      <section>
        < ShowcaseSection />
      </section>

      <section>
        <SecondaryFeaturesSection />
      </section>

      <section>
        < AppShowcaseSection />
      </section>

      <section>
        <CtaFaqSection />
      </section>

      <section>
        <VideoShowcaseSection />
      </section>




      <section>
        <Footer7 />
      </section>

    </>
  );
}
