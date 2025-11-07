// app/admin/navi-ia/page.js

"use client"; // <-- ADICIONE ESTA LINHA

import NaviChat from '../../../components/dashboard/navi-chat/NaviChat';

const ADMIN_TAGS = [
    'Qual a contagem de usuários por papel?',
    'Quantos estacionamentos estão cadastrados no total?',
    'Qual a média de avaliação global do sistema?',
    'Resuma o estado atual do sistema.',
];

const adminContextSelector = () => {
    // Esta função agora é definida no lado do cliente.
    return {}; 
}

export default function AdminNaviAIPage() {
  return (
    <div className="h-screen flex flex-col">
        {/* Agora o Next.js pode passar a função contextSelector, pois o componente pai é Client. */}
        <NaviChat 
            apiEndpoint="/api/navi/admin/ask"
            tagSuggestions={ADMIN_TAGS}
            contextSelector={adminContextSelector}
            customHeader={null} 
        />
    </div>
  );
}