-- Cria o banco de dados caso ele não exista, garantindo que o script possa ser executado múltiplas vezes.
CREATE DATABASE IF NOT EXISTS navi;

-- Seleciona o banco de dados para usar.
USE navi;

-- =================================================================================
-- Tabela de Usuários: Armazena dados de todos os tipos de usuários da plataforma.
-- =================================================================================
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    url_foto_perfil VARCHAR(255),
    papel ENUM('ADMINISTRADOR', 'PROPRIETARIO', 'MOTORISTA') NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================================================
-- Tabela de Estacionamentos: Dados cadastrais de cada estacionamento.
-- =================================================================================
CREATE TABLE estacionamento (
id_estacionamento INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(255) NOT NULL,
endereço VARCHAR(150),
tarifas DECIMAL(10,2),
horarios TIMESTAMP
);

CREATE TABLE vagas (
id_vaga INT AUTO_INCREMENT PRIMARY KEY,
id_estacionamento INT NOT NULL,
numero INT NOT NULL,
status ENUM('livre', 'ocupada') DEFAULT 'livre',
FOREIGN KEY (id_estacionamento) REFERENCES estacionamento (id_estacionamento)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);
select * from vagas;
DELETE FROM vagas WHERE id_vaga = 5;

-- =================================================================================
-- NOVO: Tabela de Planos Mensais.
-- Cada estacionamento pode oferecer diferentes planos para mensalistas.
-- =================================================================================
CREATE TABLE plano_mensal (
    id_plano INT AUTO_INCREMENT PRIMARY KEY,
    id_estacionamento INT NOT NULL,
    nome_plano VARCHAR(100) NOT NULL, -- Ex: "Plano Diurno Moto", "Plano 24h Carro"
    descricao TEXT,
    preco_mensal DECIMAL(10, 2) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE, -- Permite desativar um plano sem apagar os contratos existentes.

    FOREIGN KEY (id_estacionamento) REFERENCES estacionamento(id_estacionamento) ON DELETE CASCADE
);

-- =================================================================================
-- NOVO: Tabela de Contratos de Mensalistas.
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
-- NOVO: Tabela de Cupons de Desconto.
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
id_reserva INT NOT NULL,
valor decimal (10,2),
metodo ENUM('pix', 'debito', 'credito'),
data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

#-----------------------------------------------------------------------------------
#ideia de add avaliações

/*
CREATE TABLE avaliacao (
id_avalicao INT AUTO_INCREMENT PRIMARY KEY,
id_usuario INT NOT NULL,
data_postado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
comentário VARCHAR(500),
FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);
*/

#------------------------------------------------------------------------------------
#dropar o bagui se dar erro

#drop database navi;