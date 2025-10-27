-- Criação
CREATE TABLE IF NOT EXISTS reserva (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_vaga INT NOT NULL,
    id_veiculo INT NULL,
    codigo_confirmacao VARCHAR(100) UNIQUE,
    data_hora_inicio TIMESTAMP NOT NULL,
    data_hora_fim TIMESTAMP NULL,
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

-- Estrutura
DESCRIBE reserva;

-- Consultas
SELECT * FROM reserva;
SELECT r.id_reserva, u.nome, v.identificador, r.status
FROM reserva r
JOIN usuario u ON r.id_usuario = u.id_usuario
JOIN vaga v ON r.id_vaga = v.id_vaga;

-- Reservas ativas
SELECT COUNT(*) AS reservas_ativas FROM reserva WHERE status = 'ATIVA';
