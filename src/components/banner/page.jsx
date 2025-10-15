import { ArrowDownRight, Star } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";


const Hero3 = ({
  heading = "Estacione Rápido, Simples e Seguro",
  description = "Encontre vagas disponíveis em tempo real, gerencie seu estacionamento e facilite a vida de motoristas e administradores com Navi.",
  buttons = {
    primary: {
      text: "Conheça nosso App",
      url: "https://www.shadcnblocks.com",
    },
  },
}) => {
  return (
    <section>
      <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div className="mx-auto flex flex-col items-center text-center md:ml-auto lg:max-w-3xl lg:items-start lg:text-left">
          <h1 className="my-6 text-white text-4xl font-bold lg:text-6xl xl:text-7xl dark:text-yellow-400">
            {heading}
          </h1>
          <p className="text-white mb-8 max-w-xl lg:text-xl">
            {description}
          </p>
          <div className="mb-12 flex w-fit flex-col items-center gap-4 sm:flex-row">
            <div>

            </div>
          </div>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
            {buttons.primary && (
              <Button variant="banner" asChild className="w-full sm:w-auto">
                <a href={buttons.primary.url}>{buttons.primary.text}</a>
              </Button>
            )}
            {buttons.secondary && (
              <Button asChild variant="outline">
                <a href={buttons.secondary.url}>
                  {buttons.secondary.text}
                  <ArrowDownRight className="size-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
        <div className="flex">
          <img
            src="https://images.unsplash.com/photo-1608878746376-b65933cb0079?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=736"
            alt="placeholder hero"
            className="max-h-[600px] w-full rounded-md object-cover lg:max-h-[800px]"
          />
        </div>
      </div>
    </section>
  );
};

export { Hero3 };