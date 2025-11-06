import Header from "../../components/shadcn/navbar/page";
import Hero3 from "../../components/landingpage/banner/page";
import Navbar04Page from "../../components/shadcn/navbar-04/navbar-04";
import { Footer7 } from "../../components/shadcn/footer/footer-7";
import FeaturesSection from '../../components/teste/FeaturesSection';
import ShowcaseSection from '../../components/teste/ShowcaseSection';
import SecondaryFeaturesSection from '../../components/teste/FeaturesSection2';
import AppShowcaseSection from '../../components/teste/AppShowcase';
import FaqSection from '../../components/teste/CtaFaqSection';
import VideoShowcaseSection from '../../components/teste/VideoShowcaseSection';
import NewsSection from '../../components/teste/NewsSection';
import ContactSection from '../../components/teste/ContactSection'; 

export default function Home() {
  return (
    <>
      <Header />

      <Navbar04Page />

      <section id="inicio" className="container mx-auto py-24">
        <Hero3 />
      </section>

      <section id="funcionalidades">
        <FeaturesSection />
      </section>

      <section id="showcase">
        <ShowcaseSection />
      </section>

      <section id="perfis">
        <SecondaryFeaturesSection />
      </section>

      <section id="app">
        <AppShowcaseSection />
      </section>

      <section id="faq">
        <FaqSection />
      </section>

      <section id="video">
        <VideoShowcaseSection />
      </section>

      <section id="noticias">
        <NewsSection />
      </section>

      <section id="contato">
        <ContactSection />
      </section>

      <Footer7 />
    </>
  );
}