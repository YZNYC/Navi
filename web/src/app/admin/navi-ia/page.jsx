// app/admin/navi-ia/page.js

"use client";

import NaviChat from '../../../components/dashboard/navi-chat/NaviChat';

const ADMIN_TAGS = [
  'Qual a contagem de usuários por papel?',
  'Quantos estacionamentos estão cadastrados no total?',
  'Qual a média de avaliação global do sistema?',
  'Resuma o estado atual do sistema.',
];

const adminContextSelector = () => {
  return {};
}

export default function AdminNaviAIPage() {
  return (
    <div className="h-screen flex flex-col">
      <NaviChat
        // [CORREÇÃO] Props de layout mantidas
        apiEndpoint="/api/navi/admin/ask"
        tagSuggestions={ADMIN_TAGS}
        contextSelector={adminContextSelector}
        customHeader={null}

      // [CORREÇÃO] Prop 'userRole' REMOVIDA.
      // O componente de chat vai descobrir o papel sozinho
      // usando o hook useAuth(), que é a fonte da verdade.
      />
    </div>
  );
}