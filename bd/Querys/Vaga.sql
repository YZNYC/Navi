-- Criação
CREATE TABLE IF NOT EXISTS vaga (
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

-- Estrutura
DESCRIBE vaga;

-- Consultas
SELECT * FROM vaga;
SELECT identificador, tipo_vaga, status FROM vaga WHERE status = 'LIVRE';
SELECT id_estacionamento, COUNT(*) AS total_vagas FROM vaga GROUP BY id_estacionamento;
