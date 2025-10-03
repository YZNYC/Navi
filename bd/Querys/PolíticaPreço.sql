-- Criação
CREATE TABLE IF NOT EXISTS politica_preco (
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

-- Estrutura
DESCRIBE politica_preco;

-- Consultas
SELECT * FROM politica_preco;
SELECT descricao, preco_primeira_hora, preco_diaria FROM politica_preco;
SELECT id_estacionamento, AVG(preco_diaria) AS media_diaria
FROM politica_preco
GROUP BY id_estacionamento;
