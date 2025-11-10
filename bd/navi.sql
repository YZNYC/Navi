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