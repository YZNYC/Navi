import Header from "@/components/navbar/page";
import Banner from "../components/banner/page"
import Navbar04Page from "@/components/navbar-04/navbar-04";
import Sobre from "@/components/sobre/page";
import Funcionamento from "@/components/como-funciona/page";
import Contact02Page from "@/components/contact-02/contact-02";


export default function Home() {
  return (
    <>
      <Header/>
      <Navbar04Page/>
      <Banner/>
      <Funcionamento/>
      <Sobre/>
      <Contact02Page />
    </>
  );
}
