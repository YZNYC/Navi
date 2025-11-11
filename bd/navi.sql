-- Cria o banco de dados caso ele não exista
CREATE DATABASE IF NOT EXISTS navi;
USE navi;

-- ************************************************************
-- 🚨 ETAPA DE LIMPEZA: Recomenda-se rodar estes comandos
-- para limpar dados antigos antes de inserir novos
-- ************************************************************
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS anexo_avaliacao, avaliacao, pagamento, cupom, reserva, vaga, politica_preco, contrato_mensalista, plano_mensal, veiculo, estacionamento_funcionario, estacionamento, usuario, log;
SET FOREIGN_KEY_CHECKS = 1;


-- =================================================================================
-- TABELAS (COPIADAS DO SEU MODELO)
-- =================================================================================
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    url_foto_perfil VARCHAR(255),
    papel ENUM('ADMINISTRADOR', 'PROPRIETARIO', 'FUNCIONARIO', 'MOTORISTA') NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    resetToken VARCHAR(255) NULL UNIQUE,
    resetTokenExpires DATETIME NULL
);

CREATE TABLE estacionamento (
    id_estacionamento INT AUTO_INCREMENT PRIMARY KEY,
    id_proprietario INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    cep VARCHAR(9) NOT NULL,
    rua VARCHAR(255) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,    
    endereco_completo VARCHAR(500) NOT NULL, 
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(10, 8) NOT NULL,
    url_foto_principal VARCHAR(255),
    horario_abertura TIME,
    horario_fechamento TIME,
    dias_funcionamento VARCHAR(100),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_proprietario) REFERENCES usuario(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY endereco_unico (cep, numero),
    UNIQUE KEY localizacao_unica (latitude, longitude)
);

-- ... (Outras tabelas para a consistência do BD) ...
-- (O restante das tabelas do seu BD original deve ser inserido aqui para manter a consistência)


-- =================================================================================
-- INSERTS DE DADOS (PARA PAGINAÇÃO)
-- =================================================================================

-- Senha padrão para todos: 'senha123' (hash gerado: $2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW)
SET @senha_hash = '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW'; 

-- 🚨 INSERTS DE USUÁRIOS (7 Usuários) - Para Paginação de Usuários
INSERT IGNORE INTO usuario (id_usuario, nome, email, senha, papel, ativo) VALUES
(1, 'Admin Master', 'admin@navi.com', @senha_hash, 'ADMINISTRADOR', TRUE), -- ID 1: Administrador
(2, 'Marcos Proprietario', 'marcos@prop.com', @senha_hash, 'PROPRIETARIO', TRUE), -- ID 2: Proprietário
(3, 'Ana Proprietaria', 'ana@prop.com', @senha_hash, 'PROPRIETARIO', TRUE), -- ID 3: Proprietário
(4, 'Pedro Motorista', 'pedro@motor.com', @senha_hash, 'MOTORISTA', TRUE), -- ID 4: Motorista
(5, 'Carla Motorista', 'carla@motor.com', @senha_hash, 'MOTORISTA', TRUE), -- ID 5: Motorista
(6, 'Joao Funcionario', 'joao@func.com', @senha_hash, 'FUNCIONARIO', TRUE), -- ID 6: Funcionário
(7, 'Usuario Inativo', 'inativo@user.com', @senha_hash, 'MOTORISTA', FALSE); -- ID 7: Inativo

-- 🚨 INSERTS DE ESTACIONAMENTOS (7 Estacionamentos) - Para Paginação de Estacionamentos
INSERT INTO estacionamento 
    (id_proprietario, nome, cnpj, cep, rua, numero, bairro, cidade, estado, endereco_completo, latitude, longitude) 
VALUES
    (2, 'Estacionamento Central', '11.111.111/0001-11', '01001-000', 'Praça da Sé', '100', 'Sé', 'São Paulo', 'SP', 'Praça da Sé, 100 - Sé, São Paulo - SP, 01001-000', -23.5507, -46.6343), -- 1
    (2, 'Estacionamento Paulista', '22.222.222/0001-22', '01311-200', 'Avenida Paulista', '1578', 'Bela Vista', 'São Paulo', 'SP', 'Avenida Paulista, 1578 - Bela Vista, São Paulo - SP, 01311-200', -23.5614, -46.6565), -- 2
    (3, 'Estacionamento Pinheiros', '33.333.333/0001-33', '05425-070', 'Rua dos Pinheiros', '500', 'Pinheiros', 'São Paulo', 'SP', 'Rua dos Pinheiros, 500 - Pinheiros, São Paulo - SP, 05425-070', -23.5677, -46.6953), -- 3
    (3, 'Estacionamento Ibirapuera', '44.444.444/0001-44', '04003-010', 'Rua Manoel da Nóbrega', '200', 'Vila Mariana', 'São Paulo', 'SP', 'Rua Manoel da Nóbrega, 200 - Vila Mariana', -23.5796, -46.6588), -- 4
    (1, 'Estacionamento Admin', '55.555.555/0001-55', '01046-010', 'Avenida Ipiranga', '120', 'República', 'São Paulo', 'SP', 'Avenida Ipiranga, 120 - República', -23.5458, -46.6366), -- 5
    (2, 'Estacionamento Desativado', '66.666.666/0001-66', '03107-000', 'Rua da Mooca', '400', 'Mooca', 'São Paulo', 'SP', 'Rua da Mooca, 400 - Mooca', -23.5583, -46.6111), -- 6 (Exemplo para o Filtro de Ativo/Inativo)
    (3, 'Estacionamento Lapa', '77.777.777/0001-77', '05073-010', 'Rua Clélia', '300', 'Lapa', 'São Paulo', 'SP', 'Rua Clélia, 300 - Lapa', -23.5262, -46.6919); -- 7
    
-- Para simular um estacionamento inativo no frontend, você precisaria de um campo 'ativo' na tabela estacionamento 
-- e um PUT que o controle. Como o campo 'ativo' não estava no seu DDL de estacionamento, 
-- usaremos apenas os 7 ativos (o que é suficiente para o teste de paginação).
    FOREIGN KEY (id_estacionamento) REFERENCES estacionamento(id_estacionamento) ON DELETE CASCADE
);

-- =================================================================================
-- Vincula um usuário e seu veículo a um plano mensal específico.
-- =================================================================================
CREATE TABLE contrato_mensalista (
    id_contrato INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_plano INT NOT NULL,
    id_veiculo INT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE, -- Pode ser nulo para renovação automática.
    status ENUM('ATIVO', 'INATIVO', 'CANCELADO') NOT NULL,

    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_plano) REFERENCES plano_mensal(id_plano) ON DELETE RESTRICT, -- Impede apagar um plano com contratos ativos.
    FOREIGN KEY (id_veiculo) REFERENCES veiculo(id_veiculo) ON DELETE CASCADE
);

-- =================================================================================
-- Tabela de Políticas de Preço: Para clientes avulsos.
-- =================================================================================
CREATE TABLE politica_preco (
    id_politica_preco INT AUTO_INCREMENT PRIMARY KEY,
    id_estacionamento INT NOT NULL,
    descricao VARCHAR(100) NOT NULL,
    preco_primeira_hora DECIMAL(10, 2) DEFAULT 0.00,
    preco_horas_adicionais DECIMAL(10, 2) DEFAULT 0.00,
    preco_diaria DECIMAL(10, 2) DEFAULT 0.00,
    ativo BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (id_estacionamento) REFERENCES estacionamento(id_estacionamento)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =================================================================================
-- Tabela de Vagas: Representa cada vaga individual em um estacionamento.
-- =================================================================================
CREATE TABLE vaga (
    id_vaga INT AUTO_INCREMENT PRIMARY KEY,
    id_estacionamento INT NOT NULL,
    identificador VARCHAR(20) NOT NULL,
    tipo_vaga ENUM('PADRAO', 'PCD', 'IDOSO', 'ELETRICO', 'MOTO') DEFAULT 'PADRAO',
    status ENUM('LIVRE', 'OCUPADA', 'RESERVADA', 'MANUTENCAO') DEFAULT 'LIVRE',
    
    FOREIGN KEY (id_estacionamento) REFERENCES estacionamento(id_estacionamento)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        
    UNIQUE (id_estacionamento, identificador)
);

-- =================================================================================
-- Tabela de Reservas: Para clientes avulsos.
-- =================================================================================
CREATE TABLE reserva (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_vaga INT NOT NULL,
    id_veiculo INT NULL,
    codigo_confirmacao VARCHAR(100) UNIQUE,
    data_hora_inicio TIMESTAMP NOT NULL,
    data_hora_fim TIMESTAMP NULL, -- CORRIGIDO: Alterado para NULL para permitir reservas ativas.
    status ENUM('ATIVA', 'CONCLUIDA', 'CANCELADA', 'EXPIRADA') NOT NULL,
    
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (id_vaga) REFERENCES vaga(id_vaga)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (id_veiculo) REFERENCES veiculo(id_veiculo)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =================================================================================
-- Para campanhas de marketing e fidelização de clientes avulsos.
-- =================================================================================
CREATE TABLE cupom (
    id_cupom INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    tipo_desconto ENUM('PERCENTUAL', 'FIXO') NOT NULL,
    valor DECIMAL(10, 2) NOT NULL, -- Se for percentual, armazena a porcentagem (ex: 10 para 10%). Se fixo, o valor (ex: 5.00 para R$5).
    data_validade DATE NOT NULL,
    usos_maximos INT DEFAULT 1,
    usos_atuais INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE
);

-- =================================================================================
-- Tabela de Pagamentos: Relacionada a uma reserva.
-- =================================================================================
CREATE TABLE pagamento (
    id_pagamento INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva INT NOT NULL UNIQUE,
    id_cupom INT NULL, -- CAMPO NOVO: Referência ao cupom utilizado.
    valor_bruto DECIMAL(10, 2) NOT NULL,
    valor_desconto DECIMAL(10, 2) DEFAULT 0.00,
    valor_liquido DECIMAL(10, 2) NOT NULL,
    metodo ENUM('PIX', 'DEBITO', 'CREDITO', 'DINHEIRO') NOT NULL,
    status ENUM('PENDENTE', 'APROVADO', 'RECUSADO', 'ESTORNADO') NOT NULL,
    url_recibo VARCHAR(255),
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva) ON DELETE CASCADE,
    FOREIGN KEY (id_cupom) REFERENCES cupom(id_cupom) ON DELETE SET NULL -- Se o cupom for apagado, o pagamento mantém o registro.
);

-- =================================================================================
-- Tabela de Avaliações: Feedbacks dos usuários sobre os estacionamentos.
-- =================================================================================
CREATE TABLE avaliacao (
    id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_estacionamento INT NOT NULL,
    nota DECIMAL(2, 1) NOT NULL,
    comentario TEXT,
    data_postagem TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_estacionamento) REFERENCES estacionamento(id_estacionamento) ON DELETE CASCADE
);

-- =================================================================================
-- Tabela de Anexos da Avaliação: Permite múltiplas imagens/vídeos por avaliação.
-- =================================================================================
CREATE TABLE anexo_avaliacao (
    id_anexo INT AUTO_INCREMENT PRIMARY KEY,
    id_avaliacao INT NOT NULL,
    tipo_anexo ENUM('IMAGEM', 'VIDEO') DEFAULT 'IMAGEM',
    url_anexo VARCHAR(255) NOT NULL,

    FOREIGN KEY (id_avaliacao) REFERENCES avaliacao(id_avaliacao) ON DELETE CASCADE
);

-- =================================================================================
-- Tabela de Logs: Para auditoria de ações importantes no sistema.
-- =================================================================================
CREATE TABLE log (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    acao VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_log TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =================================================================================
-- Tabela de mensagens: Para conversas entre o sistema.
-- =================================================================================
CREATE TABLE mensagem (
    id_mensagem INT AUTO_INCREMENT PRIMARY KEY,
    id_remetente INT NOT NULL,
    id_destinatario INT NOT NULL,
    conteudo TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lida BOOLEAN DEFAULT FALSE,
    foi_editada BOOLEAN DEFAULT FALSE,
    reply_to INT NULL,
    
    FOREIGN KEY (id_remetente) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_destinatario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (reply_to) REFERENCES mensagem(id_mensagem) ON DELETE SET NULL
);

-- =================================================================================
-- tabela de Conversas: Para exibir as conversas 
-- =================================================================================
CREATE TABLE conversa_oculta (
    id_usuario INT NOT NULL,        
    id_parceiro_chat INT NOT NULL, 
    
    PRIMARY KEY (id_usuario, id_parceiro_chat), -- Garante que a relação seja única.

    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_parceiro_chat) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);
-- =================================================================================
-- Inserts
-- =================================================================================

INSERT INTO usuario (nome, email, senha, papel) VALUES
('Marcos da Silva', 'marcos@email.com', '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', 'PROPRIETARIO'),
('Ana Costa', 'ana@email.com', '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', 'ADMINISTRADOR'),
('Carla Joana', 'carla@email.com', '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', 'MOTORISTA'),
('Pedro Almeida', 'pedro@email.com', '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', 'MOTORISTA'),
('Bruno Mendes', 'bruno.func@email.com', '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', 'MOTORISTA'), -- Será funcionário
('Sofia Lima', 'sofia@email.com', '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', 'MOTORISTA'),
('Lucas Gabriel', 'lucas@email.com', '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', 'MOTORISTA'),
('Juliana Andrade', 'juliana@email.com', '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', 'MOTORISTA'),
('Fernando Pereira', 'fernando@email.com', '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', 'MOTORISTA'),
('Beatriz Martins', 'beatriz@email.com', '$2b$10$qXMzRDjJU/b3piM8RNexA.B6iONreZ1XP9nc9DRNkhSODmJSk3cKW', 'MOTORISTA');

-- =================================================================================
-- INSERIR VEÍCULOS PARA OS MOTORISTAS
-- =================================================================================
INSERT INTO veiculo (id_usuario, placa, marca, modelo, cor) VALUES
(3, 'CAR-2025', 'Honda', 'Civic', 'Preto'),        -- Veículo 1 (Carla)
(4, 'PED-2024', 'Fiat', 'Mobi', 'Branco'),        -- Veículo 2 (Pedro)
(6, 'SOF-2023', 'Toyota', 'Yaris', 'Vermelho'),     -- Veículo 3 (Sofia)
(7, 'LUC-2022', 'Chevrolet', 'Onix', 'Prata'),      -- Veículo 4 (Lucas)
(8, 'JUL-2021', 'Hyundai', 'HB20', 'Cinza'),        -- Veículo 5 (Juliana)
(9, 'FER-2020', 'Ford', 'Ka', 'Azul'),           -- Veículo 6 (Fernando)
(10, 'BIA-2019', 'Renault', 'Kwid', 'Laranja');      -- Veículo 7 (Beatriz)

-- =================================================================================
-- INSERIR ESTACIONAMENTOS
-- =================================================================================
INSERT INTO estacionamento (id_proprietario, nome, cnpj, cep, rua, numero, bairro, cidade, estado, endereco_completo, latitude, longitude) VALUES
(1, 'Estacionamento Central', '11.111.111/0001-11', '01001-000', 'Praça da Sé', '100', 'Sé', 'São Paulo', 'SP', 'Praça da Sé, 100 - Sé, São Paulo - SP, 01001-000', -23.5507, -46.6343),
(1, 'Estacionamento Paulista', '22.222.222/0001-22', '01311-200', 'Avenida Paulista', '1578', 'Bela Vista', 'São Paulo', 'SP', 'Avenida Paulista, 1578 - Bela Vista, São Paulo - SP, 01311-200', -23.5614, -46.6565);

-- =================================================================================
-- VINCULAR FUNCIONÁRIOS
-- =================================================================================
INSERT INTO estacionamento_funcionario (id_estacionamento, id_usuario, permissao) VALUES 
(1, 5, 'GESTOR'); -- Vincula Bruno Mendes ao Estacionamento Central do Marcos

-- =================================================================================
-- INSERIR PLANOS MENSAIS (MAIS DE 6 PARA TESTAR PAGINAÇÃO)
-- =================================================================================
INSERT INTO plano_mensal (id_estacionamento, nome_plano, descricao, preco_mensal, ativo) VALUES
    (1, 'Plano Diurno - Carro', 'Acesso das 8h às 18h, Seg a Sex.', 250.00, TRUE),      -- ID 1
    (1, 'Plano Noturno - Carro', 'Acesso das 18h às 8h, todos os dias.', 180.00, TRUE),   -- ID 2
    (1, 'Plano Premium 24h', 'Acesso total, 24h por dia, 7 dias por semana.', 400.00, TRUE), -- ID 3
    (1, 'Plano Mensal - Moto', 'Acesso 24h exclusivo para motos.', 120.00, TRUE),           -- ID 4
    (1, 'Plano Flex - 10 Diárias', 'Use 10 diárias no período de um mês.', 300.00, TRUE),      -- ID 5
    (1, 'Plano Fim de Semana', 'Acesso de Sexta (18h) a Domingo (22h).', 150.00, TRUE), -- ID 6
    (1, 'Plano Comercial', 'Acesso de Seg a Sex, das 8h às 20h.', 280.00, TRUE);           -- ID 7

-- =================================================================================
-- INSERIR CONTRATOS (MAIS DE 6 PARA TESTAR PAGINAÇÃO)
-- Faz com que "Plano Premium 24h" seja o mais popular
-- =================================================================================
INSERT INTO contrato_mensalista (id_usuario, id_plano, id_veiculo, data_inicio, status) VALUES
    -- 2 contratos para Plano Diurno
    (3, 1, 1, '2025-10-01', 'ATIVO'), 
    (4, 1, 2, '2025-10-15', 'ATIVO'),
    -- 1 contrato cancelado
    (3, 2, 1, '2025-08-01', 'CANCELADO'),
    -- 5 contratos para Plano Premium (o mais popular)
    (6, 3, 3, '2025-11-01', 'ATIVO'),
    (7, 3, 4, '2025-11-02', 'ATIVO'),
    (8, 3, 5, '2025-11-03', 'ATIVO'),
    (9, 3, 6, '2025-11-04', 'ATIVO'),
    (10, 3, 7, '2025-11-05', 'ATIVO');
