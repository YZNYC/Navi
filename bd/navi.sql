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
    id_proprietario INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    url_foto_principal VARCHAR(255),
    endereco_completo TEXT NOT NULL,
    localizacao POINT NOT NULL, -- CAMPO NOVO: Substitui latitude e longitude por um tipo geoespacial otimizado.
    horario_abertura TIME,
    horario_fechamento TIME,
    dias_funcionamento VARCHAR(100),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_proprietario) REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    SPATIAL INDEX(localizacao) -- ÍNDICE NOVO: Essencial para buscas rápidas por proximidade.
);

-- =================================================================================
-- NOVO: Tabela de Funcionários do Estacionamento (Gestão de Equipe).
-- Permite que proprietários concedam acesso a seus estacionamentos para outros usuários.
-- =================================================================================
CREATE TABLE estacionamento_funcionario (
    id_estacionamento INT NOT NULL,
    id_usuario INT NOT NULL,
    permissao ENUM('GESTOR', 'OPERADOR') NOT NULL, -- GESTOR pode ver relatórios, OPERADOR apenas check-in/out.
    data_admissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_estacionamento, id_usuario), -- Garante que um usuário só tenha um papel por estacionamento.
    FOREIGN KEY (id_estacionamento) REFERENCES estacionamento(id_estacionamento) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);


-- =================================================================================
-- Tabela de Veículos: Armazena os veículos pertencentes a cada usuário motorista.
-- =================================================================================
CREATE TABLE veiculo (
    id_veiculo INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    placa VARCHAR(10) NOT NULL UNIQUE,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    cor VARCHAR(30) NOT NULL,
    url_foto_placa VARCHAR(255),
    apelido VARCHAR(50),
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

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