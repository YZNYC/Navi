-- CreateTable
CREATE TABLE `usuario` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NULL,
    `url_foto_perfil` VARCHAR(191) NULL,
    `papel` ENUM('ADMINISTRADOR', 'PROPRIETARIO', 'MOTORISTA', 'FUNCIONARIO') NOT NULL,
    `data_criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `resetToken` VARCHAR(191) NULL,
    `resetTokenExpires` DATETIME(3) NULL,

    UNIQUE INDEX `usuario_email_key`(`email`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estacionamento` (
    `id_estacionamento` INTEGER NOT NULL AUTO_INCREMENT,
    `id_proprietario` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `cep` VARCHAR(191) NOT NULL,
    `rua` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `endereco_completo` VARCHAR(191) NOT NULL,
    `latitude` DECIMAL(65, 30) NOT NULL,
    `longitude` DECIMAL(65, 30) NOT NULL,
    `url_foto_principal` VARCHAR(191) NULL,
    `horario_abertura` DATETIME(3) NULL,
    `horario_fechamento` DATETIME(3) NULL,
    `dias_funcionamento` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `data_criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `estacionamento_cnpj_key`(`cnpj`),
    UNIQUE INDEX `estacionamento_cep_numero_key`(`cep`, `numero`),
    UNIQUE INDEX `estacionamento_latitude_longitude_key`(`latitude`, `longitude`),
    PRIMARY KEY (`id_estacionamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estacionamento_funcionario` (
    `id_estacionamento` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,
    `permissao` VARCHAR(191) NOT NULL,
    `data_admissao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_estacionamento`, `id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `veiculo` (
    `id_veiculo` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `placa` VARCHAR(191) NOT NULL,
    `marca` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NOT NULL,
    `cor` VARCHAR(191) NOT NULL,
    `url_foto_placa` VARCHAR(191) NULL,
    `apelido` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `data_criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `veiculo_placa_key`(`placa`),
    PRIMARY KEY (`id_veiculo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vaga` (
    `id_vaga` INTEGER NOT NULL AUTO_INCREMENT,
    `id_estacionamento` INTEGER NOT NULL,
    `identificador` VARCHAR(191) NOT NULL,
    `tipo_vaga` ENUM('PADRAO', 'PCD', 'IDOSO', 'ELETRICO', 'MOTO') NOT NULL DEFAULT 'PADRAO',
    `status` ENUM('LIVRE', 'OCUPADA', 'RESERVADA', 'MANUTENCAO') NOT NULL DEFAULT 'LIVRE',

    UNIQUE INDEX `vaga_id_estacionamento_identificador_key`(`id_estacionamento`, `identificador`),
    PRIMARY KEY (`id_vaga`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `politica_preco` (
    `id_politica_preco` INTEGER NOT NULL AUTO_INCREMENT,
    `id_estacionamento` INTEGER NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `preco_primeira_hora` DECIMAL(65, 30) NOT NULL DEFAULT 0.00,
    `preco_horas_adicionais` DECIMAL(65, 30) NOT NULL DEFAULT 0.00,
    `preco_diaria` DECIMAL(65, 30) NOT NULL DEFAULT 0.00,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `politica_preco_id_estacionamento_descricao_key`(`id_estacionamento`, `descricao`),
    PRIMARY KEY (`id_politica_preco`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plano_mensal` (
    `id_plano` INTEGER NOT NULL AUTO_INCREMENT,
    `id_estacionamento` INTEGER NOT NULL,
    `nome_plano` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `preco_mensal` DECIMAL(65, 30) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `plano_mensal_id_estacionamento_nome_plano_key`(`id_estacionamento`, `nome_plano`),
    PRIMARY KEY (`id_plano`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contrato_mensalista` (
    `id_contrato` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_plano` INTEGER NOT NULL,
    `id_veiculo` INTEGER NOT NULL,
    `data_inicio` DATETIME(3) NOT NULL,
    `data_fim` DATETIME(3) NULL,
    `status` ENUM('ATIVO', 'INATIVO', 'CANCELADO') NOT NULL,

    PRIMARY KEY (`id_contrato`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reserva` (
    `id_reserva` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_vaga` INTEGER NOT NULL,
    `id_veiculo` INTEGER NULL,
    `codigo_confirmacao` VARCHAR(191) NULL,
    `data_hora_inicio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_hora_fim` DATETIME(3) NULL,
    `status` ENUM('ATIVA', 'CONCLUIDA', 'CANCELADA', 'EXPIRADA') NOT NULL,

    PRIMARY KEY (`id_reserva`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pagamento` (
    `id_pagamento` INTEGER NOT NULL AUTO_INCREMENT,
    `id_reserva` INTEGER NOT NULL,
    `id_cupom` INTEGER NULL,
    `valor_bruto` DECIMAL(65, 30) NOT NULL,
    `valor_desconto` DECIMAL(65, 30) NOT NULL DEFAULT 0.00,
    `valor_liquido` DECIMAL(65, 30) NOT NULL,
    `metodo` ENUM('PIX', 'DEBITO', 'CREDITO', 'DINHEIRO') NOT NULL,
    `status` ENUM('PENDENTE', 'APROVADO', 'RECUSADO', 'ESTORNADO') NOT NULL,
    `url_recibo` VARCHAR(191) NULL,
    `data_hora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `pagamento_id_reserva_key`(`id_reserva`),
    PRIMARY KEY (`id_pagamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cupom` (
    `id_cupom` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `tipo_desconto` ENUM('PERCENTUAL', 'FIXO') NOT NULL,
    `valor` DECIMAL(65, 30) NOT NULL,
    `data_validade` DATETIME(3) NOT NULL,
    `usos_maximos` INTEGER NOT NULL DEFAULT 1,
    `usos_atuais` INTEGER NOT NULL DEFAULT 0,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `cupom_codigo_key`(`codigo`),
    PRIMARY KEY (`id_cupom`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacao` (
    `id_avaliacao` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_estacionamento` INTEGER NOT NULL,
    `nota` DECIMAL(65, 30) NOT NULL,
    `comentario` VARCHAR(191) NULL,
    `data_postagem` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_avaliacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anexo_avaliacao` (
    `id_anexo` INTEGER NOT NULL AUTO_INCREMENT,
    `id_avaliacao` INTEGER NOT NULL,
    `tipo_anexo` ENUM('IMAGEM', 'VIDEO') NOT NULL,
    `url_anexo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_anexo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NULL,
    `data_criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatParticipante` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_chat` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,
    `ultimo_acesso` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ChatParticipante_id_chat_id_usuario_key`(`id_chat`, `id_usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mensagem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_chat` INTEGER NOT NULL,
    `id_remetente` INTEGER NOT NULL,
    `conteudo` VARCHAR(191) NULL,
    `data_envio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MensagemAnexo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_mensagem` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `nome_arquivo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LeituraMensagem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_mensagem` INTEGER NOT NULL,
    `id_leitor` INTEGER NOT NULL,
    `data_leitura` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LeituraMensagem_id_mensagem_id_leitor_key`(`id_mensagem`, `id_leitor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `estacionamento` ADD CONSTRAINT `estacionamento_id_proprietario_fkey` FOREIGN KEY (`id_proprietario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estacionamento_funcionario` ADD CONSTRAINT `estacionamento_funcionario_id_estacionamento_fkey` FOREIGN KEY (`id_estacionamento`) REFERENCES `estacionamento`(`id_estacionamento`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estacionamento_funcionario` ADD CONSTRAINT `estacionamento_funcionario_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `veiculo` ADD CONSTRAINT `veiculo_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vaga` ADD CONSTRAINT `vaga_id_estacionamento_fkey` FOREIGN KEY (`id_estacionamento`) REFERENCES `estacionamento`(`id_estacionamento`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `politica_preco` ADD CONSTRAINT `politica_preco_id_estacionamento_fkey` FOREIGN KEY (`id_estacionamento`) REFERENCES `estacionamento`(`id_estacionamento`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plano_mensal` ADD CONSTRAINT `plano_mensal_id_estacionamento_fkey` FOREIGN KEY (`id_estacionamento`) REFERENCES `estacionamento`(`id_estacionamento`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contrato_mensalista` ADD CONSTRAINT `contrato_mensalista_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contrato_mensalista` ADD CONSTRAINT `contrato_mensalista_id_plano_fkey` FOREIGN KEY (`id_plano`) REFERENCES `plano_mensal`(`id_plano`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contrato_mensalista` ADD CONSTRAINT `contrato_mensalista_id_veiculo_fkey` FOREIGN KEY (`id_veiculo`) REFERENCES `veiculo`(`id_veiculo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva` ADD CONSTRAINT `reserva_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva` ADD CONSTRAINT `reserva_id_vaga_fkey` FOREIGN KEY (`id_vaga`) REFERENCES `vaga`(`id_vaga`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva` ADD CONSTRAINT `reserva_id_veiculo_fkey` FOREIGN KEY (`id_veiculo`) REFERENCES `veiculo`(`id_veiculo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagamento` ADD CONSTRAINT `pagamento_id_reserva_fkey` FOREIGN KEY (`id_reserva`) REFERENCES `reserva`(`id_reserva`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagamento` ADD CONSTRAINT `pagamento_id_cupom_fkey` FOREIGN KEY (`id_cupom`) REFERENCES `cupom`(`id_cupom`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacao` ADD CONSTRAINT `avaliacao_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacao` ADD CONSTRAINT `avaliacao_id_estacionamento_fkey` FOREIGN KEY (`id_estacionamento`) REFERENCES `estacionamento`(`id_estacionamento`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anexo_avaliacao` ADD CONSTRAINT `anexo_avaliacao_id_avaliacao_fkey` FOREIGN KEY (`id_avaliacao`) REFERENCES `avaliacao`(`id_avaliacao`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatParticipante` ADD CONSTRAINT `ChatParticipante_id_chat_fkey` FOREIGN KEY (`id_chat`) REFERENCES `Chat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatParticipante` ADD CONSTRAINT `ChatParticipante_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mensagem` ADD CONSTRAINT `Mensagem_id_chat_fkey` FOREIGN KEY (`id_chat`) REFERENCES `Chat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mensagem` ADD CONSTRAINT `Mensagem_id_remetente_fkey` FOREIGN KEY (`id_remetente`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MensagemAnexo` ADD CONSTRAINT `MensagemAnexo_id_mensagem_fkey` FOREIGN KEY (`id_mensagem`) REFERENCES `Mensagem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeituraMensagem` ADD CONSTRAINT `LeituraMensagem_id_mensagem_fkey` FOREIGN KEY (`id_mensagem`) REFERENCES `Mensagem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeituraMensagem` ADD CONSTRAINT `LeituraMensagem_id_leitor_fkey` FOREIGN KEY (`id_leitor`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
