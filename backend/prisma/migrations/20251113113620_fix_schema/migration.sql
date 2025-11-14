-- RedefineIndex
CREATE INDEX `idx_anexo_avaliacao_id_avaliacao` ON `anexo_avaliacao`(`id_avaliacao`);
DROP INDEX `id_avaliacao` ON `anexo_avaliacao`;

-- RedefineIndex
CREATE INDEX `idx_avaliacao_id_estacionamento` ON `avaliacao`(`id_estacionamento`);
DROP INDEX `id_estacionamento` ON `avaliacao`;

-- RedefineIndex
CREATE INDEX `idx_avaliacao_id_usuario` ON `avaliacao`(`id_usuario`);
DROP INDEX `id_usuario` ON `avaliacao`;

-- RedefineIndex
CREATE INDEX `idx_contrato_id_plano` ON `contrato_mensalista`(`id_plano`);
DROP INDEX `id_plano` ON `contrato_mensalista`;

-- RedefineIndex
CREATE INDEX `idx_contrato_id_usuario` ON `contrato_mensalista`(`id_usuario`);
DROP INDEX `id_usuario` ON `contrato_mensalista`;

-- RedefineIndex
CREATE INDEX `idx_contrato_id_veiculo` ON `contrato_mensalista`(`id_veiculo`);
DROP INDEX `id_veiculo` ON `contrato_mensalista`;

-- RedefineIndex
CREATE INDEX `idx_conversa_oculta_id_parceiro_chat` ON `conversa_oculta`(`id_parceiro_chat`);
DROP INDEX `id_parceiro_chat` ON `conversa_oculta`;

-- RedefineIndex
CREATE UNIQUE INDEX `uq_cupom_codigo` ON `cupom`(`codigo`);
DROP INDEX `codigo` ON `cupom`;

-- RedefineIndex
CREATE UNIQUE INDEX `uq_estacionamento_cnpj` ON `estacionamento`(`cnpj`);
DROP INDEX `cnpj` ON `estacionamento`;

-- RedefineIndex
CREATE UNIQUE INDEX `uq_estacionamento_endereco` ON `estacionamento`(`cep`, `numero`);
DROP INDEX `endereco_unico` ON `estacionamento`;

-- RedefineIndex
CREATE INDEX `idx_estacionamento_id_proprietario` ON `estacionamento`(`id_proprietario`);
DROP INDEX `id_proprietario` ON `estacionamento`;

-- RedefineIndex
CREATE UNIQUE INDEX `uq_estacionamento_localizacao` ON `estacionamento`(`latitude`, `longitude`);
DROP INDEX `localizacao_unica` ON `estacionamento`;

-- RedefineIndex
CREATE INDEX `idx_estacionamento_funcionario_id_usuario` ON `estacionamento_funcionario`(`id_usuario`);
DROP INDEX `id_usuario` ON `estacionamento_funcionario`;

-- RedefineIndex
CREATE INDEX `idx_log_id_usuario` ON `log`(`id_usuario`);
DROP INDEX `id_usuario` ON `log`;

-- RedefineIndex
CREATE INDEX `idx_mensagem_id_destinatario` ON `mensagem`(`id_destinatario`);
DROP INDEX `id_destinatario` ON `mensagem`;

-- RedefineIndex
CREATE INDEX `idx_mensagem_id_remetente` ON `mensagem`(`id_remetente`);
DROP INDEX `id_remetente` ON `mensagem`;

-- RedefineIndex
CREATE INDEX `idx_mensagem_reply_to` ON `mensagem`(`reply_to`);
DROP INDEX `reply_to` ON `mensagem`;

-- RedefineIndex
CREATE INDEX `idx_pagamento_id_cupom` ON `pagamento`(`id_cupom`);
DROP INDEX `id_cupom` ON `pagamento`;

-- RedefineIndex
CREATE UNIQUE INDEX `uq_pagamento_id_reserva` ON `pagamento`(`id_reserva`);
DROP INDEX `id_reserva` ON `pagamento`;

-- RedefineIndex
CREATE INDEX `idx_plano_id_estacionamento` ON `plano_mensal`(`id_estacionamento`);
DROP INDEX `id_estacionamento` ON `plano_mensal`;

-- RedefineIndex
CREATE INDEX `idx_politica_preco_id_estacionamento` ON `politica_preco`(`id_estacionamento`);
DROP INDEX `id_estacionamento` ON `politica_preco`;

-- RedefineIndex
CREATE UNIQUE INDEX `uq_reserva_codigo_confirmacao` ON `reserva`(`codigo_confirmacao`);
DROP INDEX `codigo_confirmacao` ON `reserva`;

-- RedefineIndex
CREATE INDEX `idx_reserva_id_usuario` ON `reserva`(`id_usuario`);
DROP INDEX `id_usuario` ON `reserva`;

-- RedefineIndex
CREATE INDEX `idx_reserva_id_vaga` ON `reserva`(`id_vaga`);
DROP INDEX `id_vaga` ON `reserva`;

-- RedefineIndex
CREATE INDEX `idx_reserva_id_veiculo` ON `reserva`(`id_veiculo`);
DROP INDEX `id_veiculo` ON `reserva`;

-- RedefineIndex
CREATE UNIQUE INDEX `uq_usuario_email` ON `usuario`(`email`);
DROP INDEX `email` ON `usuario`;

-- RedefineIndex
CREATE UNIQUE INDEX `uq_usuario_resetToken` ON `usuario`(`resetToken`);
DROP INDEX `resetToken` ON `usuario`;

-- RedefineIndex
CREATE UNIQUE INDEX `uq_vaga_estacionamento_identificador` ON `vaga`(`id_estacionamento`, `identificador`);
DROP INDEX `id_estacionamento` ON `vaga`;

-- RedefineIndex
CREATE INDEX `idx_veiculo_id_usuario` ON `veiculo`(`id_usuario`);
DROP INDEX `id_usuario` ON `veiculo`;

-- RedefineIndex
CREATE UNIQUE INDEX `uq_veiculo_placa` ON `veiculo`(`placa`);
DROP INDEX `placa` ON `veiculo`;
