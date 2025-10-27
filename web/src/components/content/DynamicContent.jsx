import React from 'react';
import DashboardContent from './DashboardContent';
import UsersContent from './UsersContent';
import SettingsContent from './SettingsContent';

const DynamicContent = ({ contentName }) => {
  switch (contentName) {
    case 'dashboard':
      return <DashboardContent />;
    case 'users':
      return <UsersContent />;
    case 'settings':
      return <SettingsContent />;
    default:
      return (
        <div className="p-8 text-gray-500">
          <h2 className="text-2xl font-semibold">Selecione uma opção na Sidebar.</h2>
        </div>
      );
  }
};

export default DynamicContent;