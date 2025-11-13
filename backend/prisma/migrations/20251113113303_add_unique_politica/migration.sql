/*
  Warnings:

  - A unique constraint covering the columns `[id_estacionamento,descricao]` on the table `politica_preco` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `estacionamento` ADD COLUMN `ativo` BOOLEAN NULL DEFAULT true;

-- AlterTable
ALTER TABLE `politica_preco` MODIFY `ativo` BOOLEAN NULL DEFAULT true;

-- CreateTable
CREATE TABLE `conversa_oculta` (
    `id_usuario` INTEGER NOT NULL,
    `id_parceiro_chat` INTEGER NOT NULL,

    INDEX `id_parceiro_chat`(`id_parceiro_chat`),
    PRIMARY KEY (`id_usuario`, `id_parceiro_chat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mensagem` (
    `id_mensagem` INTEGER NOT NULL AUTO_INCREMENT,
    `id_remetente` INTEGER NOT NULL,
    `id_destinatario` INTEGER NOT NULL,
    `conteudo` TEXT NOT NULL,
    `timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `lida` BOOLEAN NULL DEFAULT false,
    `foi_editada` BOOLEAN NULL DEFAULT false,
    `reply_to` INTEGER NULL,
    `url_midia` VARCHAR(255) NULL,

    INDEX `id_destinatario`(`id_destinatario`),
    INDEX `id_remetente`(`id_remetente`),
    INDEX `reply_to`(`reply_to`),
    PRIMARY KEY (`id_mensagem`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `politica_preco_id_estacionamento_descricao_key` ON `politica_preco`(`id_estacionamento`, `descricao`);

-- AddForeignKey
ALTER TABLE `conversa_oculta` ADD CONSTRAINT `conversa_oculta_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `conversa_oculta` ADD CONSTRAINT `conversa_oculta_ibfk_2` FOREIGN KEY (`id_parceiro_chat`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mensagem` ADD CONSTRAINT `mensagem_ibfk_1` FOREIGN KEY (`id_remetente`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mensagem` ADD CONSTRAINT `mensagem_ibfk_2` FOREIGN KEY (`id_destinatario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `mensagem` ADD CONSTRAINT `mensagem_ibfk_3` FOREIGN KEY (`reply_to`) REFERENCES `mensagem`(`id_mensagem`) ON DELETE SET NULL ON UPDATE RESTRICT;
