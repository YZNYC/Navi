import Header from "@/components/navbar/page";
import Banner from "../components/banner/page"
import { SidebarDemo } from "@/components/sidebar/page";
import Navbar04Page from "@/components/navbar-04/navbar-04";
import Contato from "@/components/contato/page";

export default function Home() {
  return (
    <>
      {/* <SidebarDemo/> */}
      <Header />
      <Navbar04Page/>
      <Banner />
      <Contato/>

    </>
  );
}
