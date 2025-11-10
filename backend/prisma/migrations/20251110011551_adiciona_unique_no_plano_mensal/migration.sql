/*
  Warnings:

  - A unique constraint covering the columns `[cep,numero]` on the table `estacionamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[latitude,longitude]` on the table `estacionamento` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bairro` to the `estacionamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cep` to the `estacionamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade` to the `estacionamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `estacionamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `estacionamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rua` to the `estacionamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `estacionamento` ADD COLUMN `bairro` VARCHAR(100) NOT NULL,
    ADD COLUMN `cep` VARCHAR(9) NOT NULL,
    ADD COLUMN `cidade` VARCHAR(100) NOT NULL,
    ADD COLUMN `estado` VARCHAR(2) NOT NULL,
    ADD COLUMN `numero` VARCHAR(20) NOT NULL,
    ADD COLUMN `rua` VARCHAR(255) NOT NULL,
    MODIFY `endereco_completo` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `politica_preco` ADD COLUMN `ativo` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `usuario` MODIFY `papel` ENUM('ADMINISTRADOR', 'PROPRIETARIO', 'FUNCIONARIO', 'MOTORISTA') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `endereco_unico` ON `estacionamento`(`cep`, `numero`);

-- CreateIndex
CREATE UNIQUE INDEX `localizacao_unica` ON `estacionamento`(`latitude`, `longitude`);
