import Header from "@/components/navbar/page";
import Hero3  from "../components/banner/page"
import Navbar04Page from "@/components/navbar-04/navbar-04";
import Sobre from "@/components/sobre/page";
import Funcionamento from "@/components/como-funciona/page";
import Contact02Page from "@/components/contact-02/contact-02";
import { Footer7 } from "@/components/footer/footer-7";


export default function Home() {
  return (
    <>
      <section>
        <Header />
      </section>

      <section>
      <Navbar04Page />
      </section>

      <section className="container mx-auto py-24">
        <Hero3 />
      </section>

      <section>
        <Sobre />
      </section>

      <section>
        <Funcionamento />
      </section>

      <section>
        <Contact02Page />
      </section>

      <section>
        <Footer7 />
      </section>
      
    </>
  );
}
