-- Criação
CREATE TABLE IF NOT EXISTS log (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    acao VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_log TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Estrutura
DESCRIBE log;

-- Consultas
SELECT * FROM log ORDER BY data_log DESC;
SELECT l.id_log, u.nome, l.acao, l.data_log
FROM log l
LEFT JOIN usuario u ON l.id_usuario = u.id_usuario
ORDER BY l.data_log DESC;

-- Contar ações mais registradas
SELECT acao, COUNT(*) AS total_ocorrencias
FROM log
GROUP BY acao
ORDER BY total_ocorrencias DESC;
