// src/components/FeaturesSection.jsx

import { MapPin, Smartphone, Car, Wallet, UserCheck, Star } from 'lucide-react';

const features = [
  { icon: MapPin, title: 'Mapa em Tempo Real', description: 'Encontre vagas livres perto de você instantaneamente, sem estresse e sem voltas.' },
  { icon: Smartphone, title: 'Reserve com um Toque', description: 'Garanta sua vaga antes de sair de casa com um sistema de reserva simples e rápido.' },
  { icon: Car, title: 'Gerencie Seus Veículos', description: 'Cadastre todos os seus veículos e selecione qual usar em cada reserva com facilidade.' },
  { icon: Wallet, title: 'Pagamento Integrado', description: 'Pague pelo app com segurança via Pix ou cartão e receba seu recibo digital na hora.' },
  { icon: UserCheck, title: 'Acesso para Proprietários', description: 'Gerencie seu estacionamento, monitore a ocupação e controle seu faturamento em um painel completo.' },
  { icon: Star, title: 'Avalie sua Experiência', description: 'Dê sua nota e ajude outros motoristas a encontrarem os melhores estacionamentos da cidade.' },
];

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 py-8 group">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/70 dark:bg-slate-800/50 shadow-lg border border-white/20 dark:border-slate-700 transition-all duration-300 ease-in-out group-hover:bg-[#FFD600] group-hover:dark:bg-indigo-500 group-hover:scale-110 group-hover:shadow-xl">
        <Icon className="h-10 w-10 text-orange-900 dark:text-indigo-400 transition-colors duration-300 group-hover:text-white" />
      </div>
      <h3 className="mt-6 text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
      <p className="mt-4 text-base text-gray-700 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
};

// Componente do círculo (funcional)
const HalfCircle = (props) => (
  <div className={`w-[250px] h-[250px] sm:w-[380px] sm:h-[380px] border-[48px] rounded-full ${props.className}`} />
);

const FeaturesSection = () => {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      
      {/* Camadas de Fundo (Claro e Escuro) */}
      <div 
        className="absolute inset-0 -z-20 transition-opacity duration-500 dark:opacity-0"
        style={{ background: 'linear-gradient(90deg, #f2b441, #ffc107, #ff8f00)' }}
      ></div>
      <div 
        style={{ background: 'linear-gradient(180deg, #2c3e50 0%, #1f2a38 50%, #0f172a 100%)' }}
      ></div>

      {/* Círculos de Fundo */}
      <div aria-hidden="true" className="absolute top-1/2 -translate-y-1/2 -left-1/4 w-3/5 h-3/5 rounded-full bg-[#ff8f00] dark:bg-purple-600/30 blur-[150px] filter -z-10"></div>
      <div aria-hidden="true" className="absolute top-1/2 -translate-y-1/2 -right-1/4 w-3/5 h-3/5 rounded-full bg-[#f2b441] dark:bg-blue-600/30 blur-[150px] filter -z-10"></div>
      <HalfCircle 
        className="absolute top-0 -left-[125px] sm:-left-[190px] opacity-20 dark:opacity-20 border-[#ffffff]/50 dark:border-white" 
      />
      
      {/* --- NOVA ESTRUTURA PARA CONTROLE TOTAL --- */}
      
      {/* Bloco de Título - INDEPENDENTE */}
      <div className="relative z-10 mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
        <p className="font-semibold uppercase tracking-wider text-orange-950/80 dark:text-indigo-400">
          Como Funciona
        </p>
        <h2 className="mt-2 text-5xl sm:text-6xl font-bold tracking-tight text-slate-800 dark:text-white">
          Estacione com Inteligência
        </h2>
        <p className="mt-6 mx-auto max-w-3xl text-xl text-gray-800 dark:text-slate-300">
          Tudo o que você precisa para uma experiência de estacionamento perfeita, do motorista ao proprietário.
        </p>
      </div>

      {/* Bloco do Retângulo - INDEPENDENTE */}
      {/* ESTA É A CLASSE QUE CONTROLA O TAMANHO. Altere w-11/12 se quiser maior ou menor */}
      <div className="relative z-10 mt-20 mx-auto w-11/12 max-w-screen-xl">
        <div className="p-8 sm:p-12 
                       bg-white/30 dark:bg-slate-800/30 
                       backdrop-blur-xl rounded-3xl shadow-2xl 
                       border border-white/50 dark:border-slate-700"
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