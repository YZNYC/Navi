// src/data/mockDashboardData.js

export const mockDashboardData = {
  summary: {
    newUsers: { value: 1250, change: 12.5 }, // %
    newEstablishments: { value: 45, change: -2.1 },
    activeSubscribers: { value: 780, change: 8.3 },
    platformRevenue: { value: 15200.75, change: 5.1 }, // R$
  },

  charts: {
    platformRevenue: [
      { name: 'Jan', platform: 4000, establishments: 4000 },
      { name: 'Fev', platform: 3000, establishments: 13980 },
      { name: 'Mar', platform: 2000, establishments: 9800 },
      { name: 'Abr', platform: 2780, establishments: 3080 },
      { name: 'Mai', platform: 1890, establishments: 20000 },
      { name: 'Jun', platform: 9090, establishments: 38000 },
      { name: 'Jul', platform: 7490, establishments: 48000 },
      { name: 'Ago', platform: 3090, establishments: 10000 },
      { name: 'Set', platform: 6790, establishments: 18000 },
      { name: 'Out', platform: 9490, establishments: 40000 },
    ],
    userGrowth: [
      { name: 'Jan', motoristas: 2000, estacionamentos: 50 },
      { name: 'Fev', motoristas: 2200, estacionamentos: 55 },
      { name: 'Mar', motoristas: 2500, estacionamentos: 60 },
      { name: 'Abr', motoristas: 2800, estacionamentos: 68 },
      { name: 'Mai', motoristas: 3100, estacionamentos: 75 },
      { name: 'Jun', motoristas: 3400, estacionamentos: 80 },
      { name: 'Jul', motoristas: 3800, estacionamentos: 990 },
      { name: 'Ago', motoristas: 2930, estacionamentos: 750 },
      { name: 'Set', motoristas: 4000, estacionamentos: 890 },
      { name: 'Out', motoristas: 5200, estacionamentos: 620 },
    ],
    vacancyUtilization: [
      { name: 'Seg', total: 500, ocupadas: 350, livres: 150 },
      { name: 'Ter', total: 500, ocupadas: 400, livres: 100 },
      { name: 'Qua', total: 500, ocupadas: 380, livres: 120 },
      { name: 'Qui', total: 500, ocupadas: 420, livres: 80 },
      { name: 'Sex', total: 500, ocupadas: 450, livres: 50 },
      { name: 'Sab', total: 500, ocupadas: 200, livres: 300 },
      { name: 'Dom', total: 500, ocupadas: 100, livres: 400 },
    ],
    subscriptionPlans: [
      { name: 'Básico', subscribers: 500, revenue: 5000 },
      { name: 'Premium', subscribers: 200, revenue: 8000 },
      { name: 'Pro', subscribers: 80, revenue: 6000 },
    ],
    topEstablishments: [
      { id: 1, name: 'Estacionamento Central', platformRevenue: 1200, rentedVacancies: 150, rating: 4.8 },
      { id: 2, name: 'Park Express', platformRevenue: 950, rentedVacancies: 120, rating: 4.5 },
      { id: 3, name: 'Vaga Fácil', platformRevenue: 880, rentedVacancies: 110, rating: 4.6 },
      { id: 4, name: 'City Parking', platformRevenue: 720, rentedVacancies: 90, rating: 4.2 },
      { id: 5, name: 'Premium Park', platformRevenue: 600, rentedVacancies: 80, rating: 4.9 },
    ],
  },
};

// --- MOCK DE DADOS DE USUÁRIOS (Adicionado para resolver o ReferenceError) ---
export const mockUsers = [
  { id: 1, name: 'João Silva', email: 'joao.silva@email.com', role: 'motorista', isActive: true },
  { id: 2, name: 'Maria Oliveira', email: 'maria.o@email.com', role: 'proprietario', isActive: false },
  { id: 3, name: 'Carlos Santos', email: 'carlos.s@email.com', role: 'motorista', isActive: true },
  { id: 4, name: 'Ana Souza', email: 'ana.s@email.com', role: 'proprietario', isActive: true },
  { id: 5, name: 'Pedro Costa', email: 'pedro.c@email.com', role: 'motorista', isActive: true },
  { id: 6, name: 'Luciana Lima', email: 'luciana.l@email.com', role: 'motorista', isActive: false },
];

// --- MOCK DE DADOS DE ESTACIONAMENTOS (Adicionado para resolver o ReferenceError) ---
export const mockEstablishments = [
  { id: 101, name: 'Park Central', cnpj: '12.345.678/0001-90', address: 'Rua A, 123 - Centro', status: 'verified', rating: 4.8 },
  { id: 102, name: 'Garagem Express', cnpj: '98.765.432/0001-10', address: 'Av. Brasil, 456 - Bairro X', status: 'pending', rating: 4.5 },
  { id: 103, name: 'Vaga Segura', cnpj: '11.222.333/0001-40', address: 'Praça da Liberdade, 789', status: 'verified', rating: 4.6 },
  { id: 104, name: 'AutoPark Premium', cnpj: '44.555.666/0001-70', address: 'Travessa Y, 10 - Zona Oeste', status: 'deactivated', rating: 4.2 },
  { id: 105, name: 'Estacione Fácil', cnpj: '77.888.999/0001-20', address: 'Rua Z, 500 - Zona Sul', status: 'pending', rating: 3.9 },
  { id: 106, name: 'Estacionamento do Manão', cnpj: '12.573.999/0001-59', address: 'Rua L, 20 - Zona Norte', status: 'pending', rating: 2.9 },
  { id: 107, name: 'Estaci Park', cnpj: '77.694.382/0001-20', address: 'Rua M, 80 - Zona Leste', status: 'pending', rating: 2.1 },
];