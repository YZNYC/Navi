"use client";

// -----------------------------------------------------------------------------
// IMPORTAÇÕES E ELEMENTOS AUXILIARES
// -----------------------------------------------------------------------------

import { MapPin, Smartphone, Car, Wallet, UserCheck, Star } from 'lucide-react';

// -----------------------------------------------------------------------------
// DADOS PARA OS CARDS 
// -----------------------------------------------------------------------------

const features = [
  { icon: MapPin, title: 'Mapa em Tempo Real', description: 'Encontre vagas livres perto de você instantaneamente, sem estresse и sem voltas.' },
  { icon: Smartphone, title: 'Reserve com um Toque', description: 'Garanta sua vaga antes de sair de casa com um sistema de reserva simples e rápido.' },
  { icon: Car, title: 'Gerencie Seus Veículos', description: 'Cadastre todos os seus veículos e selecione qual usar em cada reserva com facilidade.' },
  { icon: Wallet, title: 'Pagamento Integrado', description: 'Pague pelo app com segurança via Pix ou cartão e receba seu recibo digital na hora.' },
  { icon: UserCheck, title: 'Acesso para Proprietários', description: 'Gerencie seu estacionamento, monitore a ocupação e controle seu faturamento.' },
  { icon: Star, title: 'Avalie sua Experiência', description: 'Dê sua nota e ajude outros motoristas a encontrarem os melhores estacionamentos.' },
];

// -----------------------------------------------------------------------------
// CARD DE FEATURE
// -----------------------------------------------------------------------------

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 py-8 group">

      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/70 dark:bg-slate-800/50 shadow-lg border border-white/20 dark:border-slate-700 transition-all duration-300 ease-in-out group-hover:bg-[#FFD600] group-hover:dark:bg-[#ffffff] group-hover:scale-110 group-hover:shadow-xl">

        <Icon className="h-10 w-10 text-orange-900 dark:text-[#f6bb00] transition-colors duration-300 group-hover:text-white" />
      </div>

      <h3 className="mt-6 text-xl font-bold text-white [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)] dark:text-slate-100 dark:[text-shadow:none]">{title}</h3>
      <p className="mt-4 text-base text-slate-100 [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)] dark:text-slate-400 dark:[text-shadow:none] leading-relaxed">{description}</p>
    </div>
  );
};


  // -----------------------------------------------------------------------------
  // COMPONENTES AUXILIARES 
  // -----------------------------------------------------------------------------

  const HalfCircle = (props) => (
    <div className={`w-[250px] h-[250px] sm:w-[380px] sm:h-[380px] border-[48px] rounded-full ${props.className}`} />
  );

  // -----------------------------------------------------------------------------
  // CONTEÚDO PRINCIPAL 
  // -----------------------------------------------------------------------------

  const FeaturesSection = () => {
    return (
      <section className="relative py-24 sm:py-32 overflow-hidden">

        <div
          className="absolute inset-0 -z-20 transition-opacity duration-500 dark:opacity-0"
          style={{ background: 'linear-gradient(90deg, #f2b441, #ffc107, #ff8f00)' }}
        ></div>
        <div
          style={{ background: 'linear-gradient(180deg, #2c3e50 0%, #1f2a38 50%, #0f172a 100%)' }}
        ></div>


        <div aria-hidden="true" className="absolute top-1/2 -translate-y-1/2 -left-1/4 w-3/5 h-3/5 rounded-full bg-[#ff8f00] dark:bg-[#d08700]/20 blur-[150px] filter -z-10"></div>
        <div aria-hidden="true" className="absolute top-1/2 -translate-y-1/2 -right-1/4 w-3/5 h-3/5 rounded-full bg-[#f2b441] dark:bg-[#f6bb00]/20 blur-[150px] filter -z-10"></div>
        <HalfCircle
          className="absolute top-0 -left-[125px] sm:-left-[190px] opacity-20 dark:opacity-20 border-[#ffffff]/50 dark:border-[#ffffff]/50"
        />

        <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
          <p className="font-semibold uppercase tracking-wider text-white dark:text-[#efb000]">
            Como Funciona
          </p>

          <h2 className="mt-2 text-5xl sm:text-6xl font-bold tracking-tight text-white [text-shadow:1px_1px_3px_rgba(0,0,0,0.3)] dark:text-white dark:[text-shadow:none]">
            Estacione com Inteligência
          </h2>
          <p className="mt-6 mx-auto max-w-3xl text-xl text-white [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)] dark:text-slate-300 dark:[text-shadow:none]">
            Tudo o que você precisa para uma experiência de estacionamento perfeita, do motorista ao proprietário.
          </p>
        </div>

        <div className="relative z-10 mt-20 mx-auto w-11/12 max-w-screen-xl">
          <div className="p-8 sm:p-12 
                       bg-white/30 dark:bg-slate-800/30 
                       backdrop-blur-xl rounded-3xl shadow-2xl 
                       border border-white/50 dark:border-[#ffffff]/50"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 sm:gap-x-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
              ))}
            </div>
          </div>
        </div>


      </section>
    );
  };

  export default FeaturesSection;