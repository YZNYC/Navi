import { HoveredLink } from "../ui/navbar-menu";
import { ModeToggle } from "../darkmode/darkMode";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-20 hidden md:block">
      <nav className="flex items-center justify-center bg-transparent h-20 px-6 relative">
        <ul className="flex items-center justify-center gap-12 text-white font-bold">
          <li><HoveredLink href="/Home">Início</HoveredLink></li>
          <li><HoveredLink href="#contato">Contato</HoveredLink></li>

          <li>
            <a href="/Home" className="flex items-center">
              <img src="/light.png" className="max-h-20 w-auto object-contain block dark:hidden" />
              <img src="/dark.png" className="max-h-20 w-auto object-contain hidden dark:block" />

            </a>
          </li>

          <li><HoveredLink href="/Sobre">Sobre</HoveredLink></li>
          <li><HoveredLink href="/Servicos">Serviços</HoveredLink></li>
        </ul>

        <div className="absolute right-6 flex items-center h-full">
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
