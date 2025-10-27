-- Criação
CREATE TABLE IF NOT EXISTS avaliacao (
    id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_estacionamento INT NOT NULL,
    nota DECIMAL(2, 1) NOT NULL,
    comentario TEXT,
    data_postagem TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_estacionamento) REFERENCES estacionamento(id_estacionamento) ON DELETE CASCADE
);

-- Estrutura
DESCRIBE avaliacao;

-- Consultas
SELECT * FROM avaliacao;
SELECT a.id_avaliacao, u.nome, e.nome AS estacionamento, a.nota, a.comentario
FROM avaliacao a
JOIN usuario u ON a.id_usuario = u.id_usuario
JOIN estacionamento e ON a.id_estacionamento = e.id_estacionamento;

-- Nota média de cada estacionamento
SELECT id_estacionamento, AVG(nota) AS media_nota
FROM avaliacao
GROUP BY id_estacionamento;
