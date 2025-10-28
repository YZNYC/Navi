-- CreateTable
CREATE TABLE `anexo_avaliacao` (
    `id_anexo` INTEGER NOT NULL AUTO_INCREMENT,
    `id_avaliacao` INTEGER NOT NULL,
    `tipo_anexo` ENUM('IMAGEM', 'VIDEO') NULL DEFAULT 'IMAGEM',
    `url_anexo` VARCHAR(255) NOT NULL,

    INDEX `id_avaliacao`(`id_avaliacao`),
    PRIMARY KEY (`id_anexo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacao` (
    `id_avaliacao` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_estacionamento` INTEGER NOT NULL,
    `nota` DECIMAL(2, 1) NOT NULL,
    `comentario` TEXT NULL,
    `data_postagem` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_estacionamento`(`id_estacionamento`),
    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_avaliacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contrato_mensalista` (
    `id_contrato` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_plano` INTEGER NOT NULL,
    `id_veiculo` INTEGER NOT NULL,
    `data_inicio` DATE NOT NULL,
    `data_fim` DATE NULL,
    `status` ENUM('ATIVO', 'INATIVO', 'CANCELADO') NOT NULL,

    INDEX `id_plano`(`id_plano`),
    INDEX `id_usuario`(`id_usuario`),
    INDEX `id_veiculo`(`id_veiculo`),
    PRIMARY KEY (`id_contrato`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cupom` (
    `id_cupom` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(50) NOT NULL,
    `descricao` TEXT NULL,
    `tipo_desconto` ENUM('PERCENTUAL', 'FIXO') NOT NULL,
    `valor` DECIMAL(10, 2) NOT NULL,
    `data_validade` DATE NOT NULL,
    `usos_maximos` INTEGER NULL DEFAULT 1,
    `usos_atuais` INTEGER NULL DEFAULT 0,
    `ativo` BOOLEAN NULL DEFAULT true,

    UNIQUE INDEX `codigo`(`codigo`),
    PRIMARY KEY (`id_cupom`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estacionamento` (
    `id_estacionamento` INTEGER NOT NULL AUTO_INCREMENT,
    `id_proprietario` INTEGER NOT NULL,
    `nome` VARCHAR(255) NOT NULL,
    `cnpj` VARCHAR(18) NOT NULL,
    `url_foto_principal` VARCHAR(255) NULL,
    `endereco_completo` TEXT NOT NULL,
    `latitude` DECIMAL(10, 8) NOT NULL,
    `longitude` DECIMAL(10, 8) NOT NULL,
    `horario_abertura` TIME(0) NULL,
    `horario_fechamento` TIME(0) NULL,
    `dias_funcionamento` VARCHAR(100) NULL,
    `data_criacao` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `cnpj`(`cnpj`),
    INDEX `id_proprietario`(`id_proprietario`),
    PRIMARY KEY (`id_estacionamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estacionamento_funcionario` (
    `id_estacionamento` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,
    `permissao` ENUM('GESTOR', 'OPERADOR') NOT NULL,
    `data_admissao` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_estacionamento`, `id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log` (
    `id_log` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NULL,
    `acao` VARCHAR(100) NOT NULL,
    `descricao` TEXT NULL,
    `data_log` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_log`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pagamento` (
    `id_pagamento` INTEGER NOT NULL AUTO_INCREMENT,
    `id_reserva` INTEGER NOT NULL,
    `id_cupom` INTEGER NULL,
    `valor_bruto` DECIMAL(10, 2) NOT NULL,
    `valor_desconto` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `valor_liquido` DECIMAL(10, 2) NOT NULL,
    `metodo` ENUM('PIX', 'DEBITO', 'CREDITO', 'DINHEIRO') NOT NULL,
    `status` ENUM('PENDENTE', 'APROVADO', 'RECUSADO', 'ESTORNADO') NOT NULL,
    `url_recibo` VARCHAR(255) NULL,
    `data_hora` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `id_reserva`(`id_reserva`),
    INDEX `id_cupom`(`id_cupom`),
    PRIMARY KEY (`id_pagamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plano_mensal` (
    `id_plano` INTEGER NOT NULL AUTO_INCREMENT,
    `id_estacionamento` INTEGER NOT NULL,
    `nome_plano` VARCHAR(100) NOT NULL,
    `descricao` TEXT NULL,
    `preco_mensal` DECIMAL(10, 2) NOT NULL,
    `ativo` BOOLEAN NULL DEFAULT true,

    INDEX `id_estacionamento`(`id_estacionamento`),
    PRIMARY KEY (`id_plano`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `politica_preco` (
    `id_politica_preco` INTEGER NOT NULL AUTO_INCREMENT,
    `id_estacionamento` INTEGER NOT NULL,
    `descricao` VARCHAR(100) NOT NULL,
    `preco_primeira_hora` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `preco_horas_adicionais` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `preco_diaria` DECIMAL(10, 2) NULL DEFAULT 0.00,

    INDEX `id_estacionamento`(`id_estacionamento`),
    PRIMARY KEY (`id_politica_preco`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reserva` (
    `id_reserva` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_vaga` INTEGER NOT NULL,
    `id_veiculo` INTEGER NULL,
    `codigo_confirmacao` VARCHAR(100) NULL,
    `data_hora_inicio` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `data_hora_fim` TIMESTAMP(0) NULL,
    `status` ENUM('ATIVA', 'CONCLUIDA', 'CANCELADA', 'EXPIRADA') NOT NULL,

    UNIQUE INDEX `codigo_confirmacao`(`codigo_confirmacao`),
    INDEX `id_usuario`(`id_usuario`),
    INDEX `id_vaga`(`id_vaga`),
    INDEX `id_veiculo`(`id_veiculo`),
    PRIMARY KEY (`id_reserva`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `telefone` VARCHAR(20) NULL,
    `url_foto_perfil` VARCHAR(255) NULL,
    `papel` ENUM('ADMINISTRADOR', 'PROPRIETARIO', 'MOTORISTA') NOT NULL,
    `data_criacao` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ativo` BOOLEAN NULL DEFAULT true,
    `resetToken` VARCHAR(255) NULL,
    `resetTokenExpires` DATETIME(0) NULL,

    UNIQUE INDEX `email`(`email`),
    UNIQUE INDEX `resetToken`(`resetToken`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vaga` (
    `id_vaga` INTEGER NOT NULL AUTO_INCREMENT,
    `id_estacionamento` INTEGER NOT NULL,
    `identificador` VARCHAR(20) NOT NULL,
    `tipo_vaga` ENUM('PADRAO', 'PCD', 'IDOSO', 'ELETRICO', 'MOTO') NULL DEFAULT 'PADRAO',
    `status` ENUM('LIVRE', 'OCUPADA', 'RESERVADA', 'MANUTENCAO') NULL DEFAULT 'LIVRE',

    UNIQUE INDEX `id_estacionamento`(`id_estacionamento`, `identificador`),
    PRIMARY KEY (`id_vaga`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `veiculo` (
    `id_veiculo` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `placa` VARCHAR(10) NOT NULL,
    `marca` VARCHAR(50) NOT NULL,
    `modelo` VARCHAR(50) NOT NULL,
    `cor` VARCHAR(30) NOT NULL,
    `url_foto_placa` VARCHAR(255) NULL,
    `apelido` VARCHAR(50) NULL,
    `ativo` BOOLEAN NULL DEFAULT true,
    `data_criacao` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `placa`(`placa`),
    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_veiculo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `anexo_avaliacao` ADD CONSTRAINT `anexo_avaliacao_ibfk_1` FOREIGN KEY (`id_avaliacao`) REFERENCES `avaliacao`(`id_avaliacao`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `avaliacao` ADD CONSTRAINT `avaliacao_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `avaliacao` ADD CONSTRAINT `avaliacao_ibfk_2` FOREIGN KEY (`id_estacionamento`) REFERENCES `estacionamento`(`id_estacionamento`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `contrato_mensalista` ADD CONSTRAINT `contrato_mensalista_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `contrato_mensalista` ADD CONSTRAINT `contrato_mensalista_ibfk_2` FOREIGN KEY (`id_plano`) REFERENCES `plano_mensal`(`id_plano`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `contrato_mensalista` ADD CONSTRAINT `contrato_mensalista_ibfk_3` FOREIGN KEY (`id_veiculo`) REFERENCES `veiculo`(`id_veiculo`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `estacionamento` ADD CONSTRAINT `estacionamento_ibfk_1` FOREIGN KEY (`id_proprietario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estacionamento_funcionario` ADD CONSTRAINT `estacionamento_funcionario_ibfk_1` FOREIGN KEY (`id_estacionamento`) REFERENCES `estacionamento`(`id_estacionamento`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `estacionamento_funcionario` ADD CONSTRAINT `estacionamento_funcionario_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `log` ADD CONSTRAINT `log_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagamento` ADD CONSTRAINT `pagamento_ibfk_1` FOREIGN KEY (`id_reserva`) REFERENCES `reserva`(`id_reserva`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pagamento` ADD CONSTRAINT `pagamento_ibfk_2` FOREIGN KEY (`id_cupom`) REFERENCES `cupom`(`id_cupom`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `plano_mensal` ADD CONSTRAINT `plano_mensal_ibfk_1` FOREIGN KEY (`id_estacionamento`) REFERENCES `estacionamento`(`id_estacionamento`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `politica_preco` ADD CONSTRAINT `politica_preco_ibfk_1` FOREIGN KEY (`id_estacionamento`) REFERENCES `estacionamento`(`id_estacionamento`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva` ADD CONSTRAINT `reserva_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva` ADD CONSTRAINT `reserva_ibfk_2` FOREIGN KEY (`id_vaga`) REFERENCES `vaga`(`id_vaga`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva` ADD CONSTRAINT `reserva_ibfk_3` FOREIGN KEY (`id_veiculo`) REFERENCES `veiculo`(`id_veiculo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vaga` ADD CONSTRAINT `vaga_ibfk_1` FOREIGN KEY (`id_estacionamento`) REFERENCES `estacionamento`(`id_estacionamento`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `veiculo` ADD CONSTRAINT `veiculo_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;
