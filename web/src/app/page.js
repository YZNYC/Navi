// src/app/page.js
import Header from "@/components/shadcn/navbar/page";
import Hero3 from "../components/landingpage/banner/page";
import Navbar04Page from "@/components/shadcn/navbar-04/navbar-04"; // Você tem 2 navbars, verifique qual quer usar
import { Footer7 } from "@/components/shadcn/footer/footer-7";
import FeaturesSection from '../components/teste/FeaturesSection';
import ShowcaseSection from '../components/teste/ShowcaseSection';
import SecondaryFeaturesSection from '../components/teste/FeaturesSection2';
import AppShowcaseSection from '../components/teste/AppShowcase';
import FaqSection from '../components/teste/CtaFaqSection'; // Supondo o nome que demos anteriormente
import VideoShowcaseSection from '../components/teste/VideoShowcaseSection';
import NewsSection from '../components/teste/NewsSection';
import ContactSection from '../components/teste/ContactSection'; // Renomeei de 'ContatcForm'

export default function Home() {
  return (
    <>
      {/* O Header já é 'fixed', não precisa estar em uma section */}
      <Header />

      {/* Não tenho certeza do que é Navbar04Page, se for outra navbar, considere remover para não ter duplicidade */}
      <Navbar04Page />

      {/* A seção principal do 'Hero' */}
      <section id="inicio" className="container mx-auto py-24">
        <Hero3 />
      </section>

      {/* Seção de Funcionalidades */}
      <section id="funcionalidades">
        <FeaturesSection />
      </section>

      {/* Seção de Demonstração (Motorista) */}
      <section id="showcase">
        <ShowcaseSection />
      </section>

      {/* Seção de Perfis/Painel */}
      <section id="perfis">
        <SecondaryFeaturesSection />
      </section>

      {/* Seção com Screenshots do App */}
      <section id="app">
        <AppShowcaseSection />
      </section>

      {/* Seção de FAQ */}
      <section id="faq">
        <FaqSection />
      </section>

      {/* Seção de Vídeo */}
      <section id="video">
        <VideoShowcaseSection />
      </section>

      {/* Seção de Notícias/Melhorias Futuras */}
      <section id="noticias">
        <NewsSection />
      </section>

      {/* Seção de Contato */}
      <section id="contato">
        <ContactSection />
      </section>



      {/* O Footer não precisa estar em uma section */}
      <Footer7 />
    </>
  );
}