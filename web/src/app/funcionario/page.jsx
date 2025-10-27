'use client';

import React, { useState } from 'react';
import DynamicContent from '../../components/content/DynamicContent';
import Sidebar from '../../components/sidebar/page';
import Header from '../../components/header-funcionario/page';

const menuItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'users', label: 'Gerenciar Usuários' },
  { key: 'settings', label: 'Configurações' },
];

export default function FuncionarioPage() {
  const [activeKey, setActiveKey] = useState('dashboard');

  const pageTitle = menuItems.find(item => item.key === activeKey)?.label || 'Funcionário';

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar
        menuItems={menuItems}
        activeKey={activeKey}
        setActiveKey={setActiveKey}
      />

      <div className="flex flex-col flex-grow overflow-hidden">

        <Header
          pageTitle={pageTitle}
        />

        <main className="flex-grow p-10 overflow-y-auto">
          <DynamicContent contentName={activeKey} />
        </main>

      </div>
    </div>
  );
}