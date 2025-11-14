/*
  Warnings:

  - The primary key for the `mensagem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `foi_editada` on the `mensagem` table. All the data in the column will be lost.
  - You are about to drop the column `id_destinatario` on the `mensagem` table. All the data in the column will be lost.
  - You are about to drop the column `id_mensagem` on the `mensagem` table. All the data in the column will be lost.
  - You are about to drop the column `lida` on the `mensagem` table. All the data in the column will be lost.
  - You are about to drop the column `reply_to` on the `mensagem` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `mensagem` table. All the data in the column will be lost.
  - You are about to drop the column `url_midia` on the `mensagem` table. All the data in the column will be lost.
  - You are about to drop the `conversa_oculta` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id` to the `Mensagem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_chat` to the `Mensagem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `conversa_oculta` DROP FOREIGN KEY `conversa_oculta_id_parceiro_chat_fkey`;

-- DropForeignKey
ALTER TABLE `conversa_oculta` DROP FOREIGN KEY `conversa_oculta_id_usuario_fkey`;

-- DropForeignKey
ALTER TABLE `estacionamento` DROP FOREIGN KEY `estacionamento_ibfk_1`;

-- DropForeignKey
ALTER TABLE `mensagem` DROP FOREIGN KEY `mensagem_id_destinatario_fkey`;

-- DropForeignKey
ALTER TABLE `mensagem` DROP FOREIGN KEY `mensagem_id_remetente_fkey`;

-- DropForeignKey
ALTER TABLE `mensagem` DROP FOREIGN KEY `mensagem_reply_to_fkey`;

-- DropForeignKey
ALTER TABLE `vaga` DROP FOREIGN KEY `vaga_ibfk_1`;

-- DropIndex
DROP INDEX `mensagem_id_destinatario_idx` ON `mensagem`;

-- DropIndex
DROP INDEX `mensagem_reply_to_fkey` ON `mensagem`;

-- AlterTable
ALTER TABLE `mensagem` DROP PRIMARY KEY,
    DROP COLUMN `foi_editada`,
    DROP COLUMN `id_destinatario`,
    DROP COLUMN `id_mensagem`,
    DROP COLUMN `lida`,
    DROP COLUMN `reply_to`,
    DROP COLUMN `timestamp`,
    DROP COLUMN `url_midia`,
    ADD COLUMN `data_envio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `id_chat` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `conversa_oculta`;

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
ALTER TABLE `vaga` ADD CONSTRAINT `vaga_id_estacionamento_fkey` FOREIGN KEY (`id_estacionamento`) REFERENCES `estacionamento`(`id_estacionamento`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatParticipante` ADD CONSTRAINT `ChatParticipante_id_chat_fkey` FOREIGN KEY (`id_chat`) REFERENCES `Chat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatParticipante` ADD CONSTRAINT `ChatParticipante_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mensagem` ADD CONSTRAINT `Mensagem_id_chat_fkey` FOREIGN KEY (`id_chat`) REFERENCES `Chat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mensagem` ADD CONSTRAINT `Mensagem_id_remetente_fkey` FOREIGN KEY (`id_remetente`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeituraMensagem` ADD CONSTRAINT `LeituraMensagem_id_mensagem_fkey` FOREIGN KEY (`id_mensagem`) REFERENCES `Mensagem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeituraMensagem` ADD CONSTRAINT `LeituraMensagem_id_leitor_fkey` FOREIGN KEY (`id_leitor`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `estacionamento_id_proprietario_idx` ON `estacionamento`(`id_proprietario`);
DROP INDEX `idx_estacionamento_id_proprietario` ON `estacionamento`;

-- RedefineIndex
CREATE UNIQUE INDEX `estacionamento_cnpj_key` ON `estacionamento`(`cnpj`);
DROP INDEX `uq_estacionamento_cnpj` ON `estacionamento`;

-- RedefineIndex
CREATE UNIQUE INDEX `estacionamento_cep_numero_key` ON `estacionamento`(`cep`, `numero`);
DROP INDEX `uq_estacionamento_endereco` ON `estacionamento`;

-- RedefineIndex
CREATE UNIQUE INDEX `estacionamento_latitude_longitude_key` ON `estacionamento`(`latitude`, `longitude`);
DROP INDEX `uq_estacionamento_localizacao` ON `estacionamento`;

-- RedefineIndex
CREATE UNIQUE INDEX `vaga_id_estacionamento_identificador_key` ON `vaga`(`id_estacionamento`, `identificador`);
DROP INDEX `uq_vaga_estacionamento_identificador` ON `vaga`;
