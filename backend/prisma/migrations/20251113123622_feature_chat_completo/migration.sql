/*
  Warnings:

  - You are about to drop the column `resetToken` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpires` on the `usuario` table. All the data in the column will be lost.
  - Made the column `lida` on table `mensagem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `foi_editada` on table `mensagem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `conversa_oculta` DROP FOREIGN KEY `conversa_oculta_ibfk_1`;

-- DropForeignKey
ALTER TABLE `conversa_oculta` DROP FOREIGN KEY `conversa_oculta_ibfk_2`;

-- DropForeignKey
ALTER TABLE `mensagem` DROP FOREIGN KEY `mensagem_ibfk_1`;

-- DropForeignKey
ALTER TABLE `mensagem` DROP FOREIGN KEY `mensagem_ibfk_2`;

-- DropForeignKey
ALTER TABLE `mensagem` DROP FOREIGN KEY `mensagem_ibfk_3`;

-- DropIndex
DROP INDEX `idx_mensagem_reply_to` ON `mensagem`;

-- DropIndex
DROP INDEX `uq_usuario_resetToken` ON `usuario`;

-- AlterTable
ALTER TABLE `mensagem` MODIFY `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `lida` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `foi_editada` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `resetToken`,
    DROP COLUMN `resetTokenExpires`;

-- AddForeignKey
ALTER TABLE `mensagem` ADD CONSTRAINT `mensagem_id_remetente_fkey` FOREIGN KEY (`id_remetente`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mensagem` ADD CONSTRAINT `mensagem_id_destinatario_fkey` FOREIGN KEY (`id_destinatario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mensagem` ADD CONSTRAINT `mensagem_reply_to_fkey` FOREIGN KEY (`reply_to`) REFERENCES `mensagem`(`id_mensagem`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversa_oculta` ADD CONSTRAINT `conversa_oculta_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversa_oculta` ADD CONSTRAINT `conversa_oculta_id_parceiro_chat_fkey` FOREIGN KEY (`id_parceiro_chat`) REFERENCES `usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `conversa_oculta_id_parceiro_chat_idx` ON `conversa_oculta`(`id_parceiro_chat`);
DROP INDEX `idx_conversa_oculta_id_parceiro_chat` ON `conversa_oculta`;

-- RedefineIndex
CREATE INDEX `mensagem_id_destinatario_idx` ON `mensagem`(`id_destinatario`);
DROP INDEX `idx_mensagem_id_destinatario` ON `mensagem`;

-- RedefineIndex
CREATE INDEX `mensagem_id_remetente_idx` ON `mensagem`(`id_remetente`);
DROP INDEX `idx_mensagem_id_remetente` ON `mensagem`;

-- RedefineIndex
CREATE UNIQUE INDEX `usuario_email_key` ON `usuario`(`email`);
DROP INDEX `uq_usuario_email` ON `usuario`;
