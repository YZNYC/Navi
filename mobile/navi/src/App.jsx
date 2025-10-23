import React from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from '../src/components/ui/toaster';
import NaviHome from '../src/components/NaviHome';
import BottomNav from '../src/components/BottomNav';

function App() {
  return (
    <>
      <Helmet>
        <title>Navi - Encontre e Reserve Estacionamentos</title>
        <meta name="description" content="Encontre e reserve estacionamentos de forma rápida e segura com o Navi. Busque vagas próximas, compare preços e garante sua vaga com antecedência." />
      </Helmet>
      <div className="min-h-screen bg-gray-50 relative">
        <NaviHome />
        <BottomNav />
        <Toaster />
      </div>
    </>
  );
}

export default App;