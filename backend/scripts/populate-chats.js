import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

// Função utilitária para criar chat caso não exista
async function iniciarChatIfNotExists(id1, id2) {
  const chatExistente = await prisma.chat.findFirst({
    where: {
      AND: [
        { chatparticipante: { some: { id_usuario: id1 } } },
        { chatparticipante: { some: { id_usuario: id2 } } }
      ]
    }
  });

  if (!chatExistente) {
    const novo = await prisma.chat.create({
      data: {
        chatparticipante: {
          create: [
            { id_usuario: id1 },
            { id_usuario: id2 }
          ]
        }
      }
    });
    console.log(`✔ Chat criado entre ${id1} e ${id2}`);
    return novo;
  }

  console.log(`↺ Chat já existia entre ${id1} e ${id2}`);
  return chatExistente;
}

async function main() {
  console.log("🚀 Criando chats automáticos...");

  // Proprietários -> Funcionários
  const estacionamentos = await prisma.estacionamento.findMany({
    select: { id_estacionamento: true, id_proprietario: true }
  });

  for (const est of estacionamentos) {
    const funcionarios = await prisma.estacionamento_funcionario.findMany({
      where: { id_estacionamento: est.id_estacionamento },
      select: { id_usuario: true }
    });

    for (const f of funcionarios) {
      if (f.id_usuario !== est.id_proprietario) {
        await iniciarChatIfNotExists(est.id_proprietario, f.id_usuario);
      }
    }
  }

  // Funcionários -> Colegas
  const vinculos = await prisma.estacionamento_funcionario.findMany({
    select: { id_estacionamento: true }
  });

  const idsEst = [...new Set(vinculos.map(v => v.id_estacionamento))];

  for (const idEst of idsEst) {
    const funcs = await prisma.estacionamento_funcionario.findMany({
      where: { id_estacionamento: idEst },
      select: { id_usuario: true }
    });

    for (let i = 0; i < funcs.length; i++) {
      for (let j = i + 1; j < funcs.length; j++) {
        await iniciarChatIfNotExists(funcs[i].id_usuario, funcs[j].id_usuario);
      }
    }
  }

  console.log("🎉 Finalizado.");
}

main()
  .catch(err => {
    console.error("❌ ERRO:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
