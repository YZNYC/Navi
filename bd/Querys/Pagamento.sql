-- Criação
CREATE TABLE IF NOT EXISTS pagamento (
    id_pagamento INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva INT NOT NULL UNIQUE,
    id_cupom INT NULL,
    valor_bruto DECIMAL(10, 2) NOT NULL,
    valor_desconto DECIMAL(10, 2) DEFAULT 0.00,
    valor_liquido DECIMAL(10, 2) NOT NULL,
    metodo ENUM('PIX', 'DEBITO', 'CREDITO', 'DINHEIRO') NOT NULL,
    status ENUM('PENDENTE', 'APROVADO', 'RECUSADO', 'ESTORNADO') NOT NULL,
    url_recibo VARCHAR(255),
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva) ON DELETE CASCADE,
    FOREIGN KEY (id_cupom) REFERENCES cupom(id_cupom) ON DELETE SET NULL
);

-- Estrutura
DESCRIBE pagamento;

-- Consultas
SELECT * FROM pagamento;
SELECT p.id_pagamento, r.id_reserva, p.metodo, p.status
FROM pagamento p
JOIN reserva r ON p.id_reserva = r.id_reserva;

-- Valor total arrecadado
SELECT SUM(valor_liquido) AS total_receita FROM pagamento WHERE status = 'APROVADO';
