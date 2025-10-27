-- Criação
CREATE TABLE IF NOT EXISTS plano_mensal (
    id_plano INT AUTO_INCREMENT PRIMARY KEY,
    id_estacionamento INT NOT NULL,
    nome_plano VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco_mensal DECIMAL(10, 2) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (id_estacionamento) REFERENCES estacionamento(id_estacionamento) ON DELETE CASCADE
);

-- Estrutura
DESCRIBE plano_mensal;

-- Consultas
SELECT * FROM plano_mensal;
SELECT nome_plano, preco_mensal FROM plano_mensal WHERE ativo = TRUE;
SELECT COUNT(*) AS total_planos, id_estacionamento FROM plano_mensal GROUP BY id_estacionamento;
