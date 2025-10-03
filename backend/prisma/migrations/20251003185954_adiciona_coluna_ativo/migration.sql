-- DropIndex
DROP INDEX `localizacao` ON `estacionamento`;

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `ativo` BOOLEAN NULL DEFAULT true;

-- CreateIndex
CREATE INDEX `localizacao` ON `estacionamento`(`localizacao`(32));
