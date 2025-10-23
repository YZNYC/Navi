-- Criação
CREATE TABLE IF NOT EXISTS estacionamento_funcionario (
    id_estacionamento INT NOT NULL,
    id_usuario INT NOT NULL,
    permissao ENUM('GESTOR', 'OPERADOR') NOT NULL,
    data_admissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_estacionamento, id_usuario),
    FOREIGN KEY (id_estacionamento) REFERENCES estacionamento(id_estacionamento) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- Estrutura
DESCRIBE estacionamento_funcionario;

-- Consultas
SELECT * FROM estacionamento_funcionario;
SELECT ef.id_estacionamento, u.nome, ef.permissao
FROM estacionamento_funcionario ef
JOIN usuario u ON ef.id_usuario = u.id_usuario;

-- Contar funcionários por estacionamento
SELECT id_estacionamento, COUNT(*) AS total_funcionarios
FROM estacionamento_funcionario
GROUP BY id_estacionamento;
