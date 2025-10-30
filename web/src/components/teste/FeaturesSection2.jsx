'use client';

// -----------------------------------------------------------------------------
// IMPORTAÇÕES E ELEMENTOS AUXILIARES
// -----------------------------------------------------------------------------

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, CheckCircle, Clock, BarChart } from 'lucide-react';

// -----------------------------------------------------------------------------
// DADOS PARA OS CARDS DE PÚBLICO
// -----------------------------------------------------------------------------

const tiers = {
  motorista: {
    individual: { name: "Para o Motorista", description: "Tudo que você precisa para estacionar sem estresse.", features: ["Encontre vagas em tempo real", "Reserve com antecedência", "Pague direto pelo app", "Gerencie seus veículos"] },
    coletivo: { name: "Para o Viajante Diário", description: "Sua rotina mais eficiente, sem perda de tempo.", features: ["Rotas otimizadas", "Descontos de fidelidade", "Relatório de gastos mensais", "Check-in/out automático"] },
  },
  proprietario: {
    individual: { name: "Para o Proprietário", description: "Digitalize seu estacionamento e aumente sua receita.", features: ["Painel de controle em tempo real", "Gestão de vagas e preços", "Relatórios financeiros", "Crie planos de mensalista"], mostPopular: true },
    coletivo: { name: "Para o Gestor de Frotas", description: "Tome decisões baseadas em dados concretos.", features: ["Previsão de ocupação", "Controle de funcionários", "Campanhas de marketing e cupons", "Suporte 24/7 para seu negócio"], mostPopular: true },
  },
  admin: {
    individual: { name: "Para Administradores", description: "Supervisione toda a plataforma de um só lugar.", features: ["Gestão de estacionamentos", "Controle de usuários", "Moderação de avaliações", "Análise de dados da plataforma"] },
    coletivo: { name: "Para a Gestão Pública", description: "Modernize a mobilidade urbana da sua cidade.", features: ["Controle de estacionamento rotativo", "Redução de congestionamento", "Dados para planejamento urbano", "Integrações com sistemas municipais"] },
  },
};

const secondaryFeatures = [
  { icon: CheckCircle, title: 'Check-in e Check-out Simples', description: 'Registre a entrada e saída de veículos com apenas alguns cliques.' },
  { icon: Clock, title: 'Controle de Tempo Real', description: 'Acompanhe o tempo de permanência de cada veículo e evite erros na cobrança.' },
  { icon: BarChart, title: 'Relatórios Claros', description: 'Acesse relatórios de faturamento para entender a performance do seu negócio.' },
];

// -----------------------------------------------------------------------------
// CARDS DE PREÇO
// -----------------------------------------------------------------------------

const PricingCard = ({ tier, isColetivo, className }) => {
  const data = isColetivo ? tier.coletivo : tier.individual;
  return (
    <div className={`relative flex flex-col p-8 rounded-2xl border-2 shadow-lg ${tier.individual.mostPopular ? 'border-amber-400 dark:border-[#efb000]' : 'border-gray-200/50 dark:border-slate-800'} ${className}`}>
      {tier.individual.mostPopular && <div className="absolute top-0 -translate-y-1/2 right-6 bg-[#efb000] dark:bg-[#efb000] text-gray-900 dark:text-gray-900 px-3 py-1 text-sm font-semibold rounded-full">Destaque</div>}
      <h3 className="text-xl font-semibold text-white [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)] dark:text-white dark:[text-shadow:none]">{data.name}</h3>
      <p className="mt-4 text-white/90 [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)] dark:text-slate-400 dark:[text-shadow:none] flex-grow">{data.description}</p>
      <ul className="mt-8 space-y-4">
        {data.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3">
            <Check className="h-5 w-5 text-amber-500 dark:text-[#f6bb00] flex-shrink-0" />
            <span className="text-white/90 [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)] dark:text-slate-300 dark:[text-shadow:none]">{feature}</span>
          </li>
        ))}
      </ul>
      <Button className="mt-10 w-full bg-[#efb000] text-gray-900 font-bold hover:bg-[#f6bb00]" variant={tier.individual.mostPopular ? 'default' : 'outline'}>Saiba Mais</Button>
    </div>
  );
};

// -----------------------------------------------------------------------------
// CARD DE FEATURE
// -----------------------------------------------------------------------------

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-6 py-8 group">
    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/70 dark:bg-slate-800/50 shadow-lg border border-white/20 dark:border-slate-700 transition-all duration-300 ease-in-out group-hover:bg-[#FFD600] group-hover:dark:bg-slate-900 group-hover:scale-110 group-hover:shadow-xl">
      <Icon className="h-10 w-10 text-orange-900 dark:text-[#f6bb00] transition-colors duration-300 group-hover:text-white" />
    </div>
    <h3 className="mt-6 text-xl font-bold text-white [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)] dark:text-slate-100 dark:[text-shadow:none]">{title}</h3>
    <p className="mt-4 text-base text-white [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)] dark:text-slate-400 dark:[text-shadow:none] leading-relaxed">{description}</p>
  </div>
);

const HalfCircle = (props) => (
  <div className={`w-[250px] h-[250px] sm:w-[380px] sm:h-[380px] border-[48px] rounded-full ${props.className}`} />
);

// -----------------------------------------------------------------------------
// CONTEUDO PRINCIPAL
// -----------------------------------------------------------------------------

const SecondaryFeaturesSection = () => {
  const [isColetivo, setIsColetivo] = useState(false);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      
      <div className="absolute inset-0 -z-20 transition-opacity duration-500 dark:opacity-0" style={{ background: 'linear-gradient(90deg, #f2b441, #ffc107, #ff8f00)' }}></div>
      <div style={{ background: 'linear-gradient(180deg, #2c3e50 0%, #1f2a38 50%, #0f172a 100%)' }}></div>
      
      <div aria-hidden="true" className="absolute top-2/3 -translate-y-1/2 -left-1/4 w-3/5 h-3/5 rounded-full bg-[#ff8f00] dark:bg-[#d08700]/20 blur-[150px] filter -z-10"></div>
      <div aria-hidden="true" className="absolute top-2/3 -translate-y-1/2 -right-1/4 w-3/5 h-3/5 rounded-full bg-[#f2b441] dark:bg-[#f6bb00]/20 blur-[150px] filter -z-10"></div>
      
      <HalfCircle
        className="absolute top-0 -left-[125px] sm:-left-[190px] opacity-20 dark:opacity-20 border-white/50 dark:border-white/50"
      />
      <HalfCircle
        className="absolute bottom-0 -right-[125px] sm:-right-[190px] opacity-20 dark:opacity-20 border-white/50 dark:border-white/50 transform rotate-180"
      />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="relative">
          <div className="mx-auto max-w-4xl text-left">
            <p className="font-semibold uppercase tracking-wider text-orange-950/80 dark:text-[#efb000]">Painel do Proprietário</p>
            <h2 className="mt-2 text-5xl sm:text-6xl font-bold tracking-tight text-white [text-shadow:1px_1px_3px_rgba(0,0,0,0.3)] dark:text-white dark:[text-shadow:none]">Gerenciamento Descomplicado</h2>
            <p className="mt-6 max-w-2xl text-xl text-white [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)] dark:text-slate-300 dark:[text-shadow:none]">Ferramentas poderosas para você ter o controle total do seu estacionamento, onde quer que esteja.</p>
          </div>
          <div className="mt-20 mx-auto w-11/12 max-w-screen-xl">
            <div className="p-8 sm:p-12 bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 sm:gap-x-8 lg:gap-x-16">
                {secondaryFeatures.map((feature, index) => (
                  <FeatureCard key={index} {...feature} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 sm:mt-32">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-semibold uppercase tracking-wider text-orange-950/80 dark:text-[#efb000]">Nossos Perfis</p>
            <h2 className="mt-2 text-5xl sm:text-6xl font-bold tracking-tight text-white [text-shadow:1px_1px_3px_rgba(0,0,0,0.3)] dark:text-white dark:[text-shadow:none]">Uma Solução para Cada Necessidade</h2>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-white [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)] dark:text-slate-300 dark:[text-shadow:none]">
              Seja você um motorista buscando praticidade ou um gestor querendo otimizar, o Navi tem a ferramenta certa.
            </p>
          </div>
          <div className="mt-16 flex items-center justify-center gap-4">
            <Label htmlFor="toggle-view" className={`font-medium transition-colors ${isColetivo ? 'text-gray-200/50 dark:text-gray-500' : 'text-white dark:text-white'}`}>Individual</Label>
            <Switch id="toggle-view" checked={isColetivo} onCheckedChange={setIsColetivo} />
            <Label htmlFor="toggle-view" className={`font-medium transition-colors ${!isColetivo ? 'text-gray-200/50 dark:text-gray-500' : 'text-white dark:text-white'}`}>Corporativo/Público</Label>
          </div>
          <div className="mt-16 mx-auto w-full max-w-screen-xl grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            <PricingCard tier={tiers.motorista} isColetivo={isColetivo} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md" />
            <PricingCard tier={tiers.proprietario} isColetivo={isColetivo} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md transform lg:scale-105" />
            <PricingCard tier={tiers.admin} isColetivo={isColetivo} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondaryFeaturesSection;