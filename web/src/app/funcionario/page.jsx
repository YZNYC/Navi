import Layout from './layout'; 

export default function DashboardPage() {
  return (
    <Layout>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
        Seja Bem-vindo!
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-indigo-500">
          <p className="text-sm text-gray-500">Notificações</p>
          <p className="text-2xl font-semibold text-gray-900">3 Novas</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-green-500">
          <p className="text-sm text-gray-500">Tarefas Pendentes</p>
          <p className="text-2xl font-semibold text-gray-900">5</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-yellow-500">
          <p className="text-sm text-gray-500">Horas Registradas</p>
          <p className="text-2xl font-semibold text-gray-900">160h</p>
        </div>
      </div>
      
    </Layout>
  );
}