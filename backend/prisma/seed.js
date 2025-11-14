import pkg from '../generated/prisma/index.js';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // =============================================================
  // USUÁRIOS
  // =============================================================
  const usuarios = await prisma.usuario.createMany({
    data: [
      { nome: 'Marcos da Silva', email: 'marcos@email.com', senha: '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', papel: 'PROPRIETARIO' },
      { nome: 'Ana Costa', email: 'ana@email.com', senha: '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', papel: 'ADMINISTRADOR' },
      { nome: 'Carla Joana', email: 'carla@email.com', senha: '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', papel: 'MOTORISTA' },
      { nome: 'Pedro Almeida', email: 'pedro@email.com', senha: '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', papel: 'MOTORISTA' },
      { nome: 'Bruno Mendes', email: 'bruno.func@email.com', senha: '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', papel: 'MOTORISTA' },
      { nome: 'Sofia Lima', email: 'sofia@email.com', senha: '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', papel: 'MOTORISTA' },
      { nome: 'Lucas Gabriel', email: 'lucas@email.com', senha: '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', papel: 'MOTORISTA' },
      { nome: 'Juliana Andrade', email: 'juliana@email.com', senha: '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', papel: 'MOTORISTA' },
      { nome: 'Fernando Pereira', email: 'fernando@email.com', senha: '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', papel: 'MOTORISTA' },
      { nome: 'Beatriz Martins', email: 'beatriz@email.com', senha: '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', papel: 'MOTORISTA' },
    ],
  });
  console.log('✅ Usuários criados');

  // =============================================================
  // VEÍCULOS
  // =============================================================
  await prisma.veiculo.createMany({
    data: [
      { id_usuario: 3, placa: 'CAR-2025', marca: 'Honda', modelo: 'Civic', cor: 'Preto' },
      { id_usuario: 4, placa: 'PED-2024', marca: 'Fiat', modelo: 'Mobi', cor: 'Branco' },
      { id_usuario: 6, placa: 'SOF-2023', marca: 'Toyota', modelo: 'Yaris', cor: 'Vermelho' },
      { id_usuario: 7, placa: 'LUC-2022', marca: 'Chevrolet', modelo: 'Onix', cor: 'Prata' },
      { id_usuario: 8, placa: 'JUL-2021', marca: 'Hyundai', modelo: 'HB20', cor: 'Cinza' },
      { id_usuario: 9, placa: 'FER-2020', marca: 'Ford', modelo: 'Ka', cor: 'Azul' },
      { id_usuario: 10, placa: 'BIA-2019', marca: 'Renault', modelo: 'Kwid', cor: 'Laranja' },
    ],
  });
  console.log('✅ Veículos criados');

  // =============================================================
  // ESTACIONAMENTOS
  // =============================================================
  await prisma.estacionamento.createMany({
    data: [
      {
        id_proprietario: 1,
        nome: 'Estacionamento Central',
        cnpj: '11.111.111/0001-11',
        cep: '01001-000',
        rua: 'Praça da Sé',
        numero: '100',
        bairro: 'Sé',
        cidade: 'São Paulo',
        estado: 'SP',
        endereco_completo: 'Praça da Sé, 100 - Sé, São Paulo - SP, 01001-000',
        latitude: -23.5507,
        longitude: -46.6343,
      },
      {
        id_proprietario: 1,
        nome: 'Estacionamento Paulista',
        cnpj: '22.222.222/0001-22',
        cep: '01311-200',
        rua: 'Avenida Paulista',
        numero: '1578',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
        endereco_completo: 'Avenida Paulista, 1578 - Bela Vista, São Paulo - SP, 01311-200',
        latitude: -23.5614,
        longitude: -46.6565,
      },
    ],
  });
  console.log('✅ Estacionamentos criados');

  // =============================================================
  // FUNCIONÁRIO VINCULADO
  // =============================================================
  await prisma.estacionamento_funcionario.create({
    data: {
      id_estacionamento: 1,
      id_usuario: 5,
      permissao: 'GESTOR',
    },
  });
  console.log('✅ Funcionário vinculado');

  // =============================================================
  // PLANOS MENSAIS
  // =============================================================
  await prisma.plano_mensal.createMany({
    data: [
      { id_estacionamento: 1, nome_plano: 'Plano Diurno - Carro', descricao: 'Acesso das 8h às 18h, Seg a Sex.', preco_mensal: 250.00, ativo: true },
      { id_estacionamento: 1, nome_plano: 'Plano Noturno - Carro', descricao: 'Acesso das 18h às 8h, todos os dias.', preco_mensal: 180.00, ativo: true },
      { id_estacionamento: 1, nome_plano: 'Plano Premium 24h', descricao: 'Acesso total, 24h por dia, 7 dias por semana.', preco_mensal: 400.00, ativo: true },
      { id_estacionamento: 1, nome_plano: 'Plano Mensal - Moto', descricao: 'Acesso 24h exclusivo para motos.', preco_mensal: 120.00, ativo: true },
      { id_estacionamento: 1, nome_plano: 'Plano Flex - 10 Diárias', descricao: 'Use 10 diárias no período de um mês.', preco_mensal: 300.00, ativo: true },
      { id_estacionamento: 1, nome_plano: 'Plano Fim de Semana', descricao: 'Acesso de Sexta (18h) a Domingo (22h).', preco_mensal: 150.00, ativo: true },
      { id_estacionamento: 1, nome_plano: 'Plano Comercial', descricao: 'Acesso de Seg a Sex, das 8h às 20h.', preco_mensal: 280.00, ativo: true },
    ],
  });
  console.log('✅ Planos mensais criados');

  // =============================================================
  // CONTRATOS MENSAIS
  // =============================================================
  await prisma.contrato_mensalista.createMany({
    data: [
      { id_usuario: 3, id_plano: 1, id_veiculo: 1, data_inicio: new Date('2025-10-01'), status: 'ATIVO' },
      { id_usuario: 4, id_plano: 1, id_veiculo: 2, data_inicio: new Date('2025-10-15'), status: 'ATIVO' },
      { id_usuario: 3, id_plano: 2, id_veiculo: 1, data_inicio: new Date('2025-08-01'), status: 'CANCELADO' },
      { id_usuario: 6, id_plano: 3, id_veiculo: 3, data_inicio: new Date('2025-11-01'), status: 'ATIVO' },
      { id_usuario: 7, id_plano: 3, id_veiculo: 4, data_inicio: new Date('2025-11-02'), status: 'ATIVO' },
      { id_usuario: 8, id_plano: 3, id_veiculo: 5, data_inicio: new Date('2025-11-03'), status: 'ATIVO' },
      { id_usuario: 9, id_plano: 3, id_veiculo: 6, data_inicio: new Date('2025-11-04'), status: 'ATIVO' },
      { id_usuario: 10, id_plano: 3, id_veiculo: 7, data_inicio: new Date('2025-11-05'), status: 'ATIVO' },
    ],
  });
  console.log('✅ Contratos criados');

  console.log('🌱 Seed finalizado com sucesso!');
}
main()
  .then(() => console.log("✅ Seed executado com sucesso!"))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
