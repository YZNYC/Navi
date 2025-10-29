export const mockDashboardData = {
  summary: {
    newUsers: { value: 1250, change: 12.5 }, // %
    newEstablishments: { value: 45, change: -2.1 },
    activeSubscribers: { value: 780, change: 8.3 },
    platformRevenue: { value: 15200.75, change: 5.1 }, // R$
  },
  charts: {
    platformRevenue: [
      { name: 'Jan', platform: 4000, establishments: 24000 },
      { name: 'Fev', platform: 3000, establishments: 13980 },
      { name: 'Mar', platform: 2000, establishments: 9800 },
      { name: 'Abr', platform: 2780, establishments: 39080 },
      { name: 'Mai', platform: 1890, establishments: 48000 },
      { name: 'Jun', platform: 2390, establishments: 38000 },
      { name: 'Jul', platform: 3490, establishments: 43000 },
    ],
    userGrowth: [
      { name: 'Jan', motoristas: 2000, estacionamentos: 50 },
      { name: 'Fev', motoristas: 2200, estacionamentos: 55 },
      { name: 'Mar', motoristas: 2500, estacionamentos: 60 },
      { name: 'Abr', motoristas: 2800, estacionamentos: 68 },
      { name: 'Mai', motoristas: 3100, estacionamentos: 75 },
      { name: 'Jun', motoristas: 3400, estacionamentos: 80 },
      { name: 'Jul', motoristas: 3800, estacionamentos: 90 },
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