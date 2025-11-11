import Header from "@/components/shadcn/navbar/page";
import Hero3 from "../components/landingpage/banner/page";
import Navbar04Page from "@/components/shadcn/navbar-04/navbar-04";
import { Footer7 } from "@/components/shadcn/footer/footer-7";
import Funcionamento from "@/components/landingpage/como-funciona/page";
import NovoFormularioContato from "@/components/landingpage/contact-02/contact-02";
import Sobre from "@/components/landingpage/sobre/page";
import Sobre2 from "@/components/landingpage/sobre2/page";

export default function Home() {
  return (
    <>
      <Header />
      <Hero3 />
      <Funcionamento/>
      <Sobre/>
      <Sobre2/>
      <NovoFormularioContato/>
      <Navbar04Page />

      <Footer7 />
    </>
  );
}