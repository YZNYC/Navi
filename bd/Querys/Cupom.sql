-- Criação
CREATE TABLE IF NOT EXISTS cupom (
    id_cupom INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    tipo_desconto ENUM('PERCENTUAL', 'FIXO') NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_validade DATE NOT NULL,
    usos_maximos INT DEFAULT 1,
    usos_atuais INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE
);

-- Estrutura
DESCRIBE cupom;

-- Consultas
SELECT * FROM cupom;
SELECT codigo, tipo_desconto, valor, data_validade FROM cupom WHERE ativo = TRUE;
SELECT COUNT(*) AS total_cupons_ativos FROM cupom WHERE ativo = TRUE;
