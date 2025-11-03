import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const defaultSocialLinks = [
  { icon: <FaInstagram className="size-5" />, href: "#", label: "Instagram" },
  { icon: <FaFacebook className="size-5" />, href: "#", label: "Facebook" },
  { icon: <FaTwitter className="size-5" />, href: "#", label: "Twitter" },
  { icon: <FaLinkedin className="size-5" />, href: "#", label: "LinkedIn" },
];

const defaultLegalLinks = [
  { name: "Termos e Condições", href: "#" },
  { name: "Politica e Privacidade", href: "#" },
];

export const Footer7 = ({
  logo = {
    url: "/",
    dark: "/light.png",
    light: "dark.png",
    alt: "logo",
    title: "Navi.com",
  },


  socialLinks = defaultSocialLinks,
  copyright = "© 2025 Navi.com.brㅤㅤㅤTodos os Direitos Reservados.",
  legalLinks = defaultLegalLinks
}) => {
  return (
    <section className="mt-32">
      <div className="container mx-auto pl-5 ">
        <div
          className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            <div className="flex items-center gap-2 lg:justify-start">
              <a href={logo.url}>
                <img
                  src={logo.light}
                  alt={logo.alt}
                  title={logo.title}
                  className="h-8 block dark:hidden"
                />
                <img
                  src={logo.dark}
                  alt={logo.alt}
                  title={logo.title}
                  className="h-8 hidden dark:block"
                />
              </a>
              <h2 className="text-xl font-semibold">{logo.title}</h2>
            </div>
            <ul className="flex items-center space-x-6 text-muted-foreground">
              {socialLinks.map((social, idx) => (
                <li key={idx} className="font-medium hover:text-primary">
                  <a href={social.href} aria-label={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className="mt-8 flex flex-col justify-between gap-4 border-t py-8 text-xs font-medium text-muted-foreground md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">{copyright}</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-primary">
                <a href={link.href}> {link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

