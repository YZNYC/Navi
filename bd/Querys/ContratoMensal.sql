-- Criação
CREATE TABLE IF NOT EXISTS contrato_mensalista (
    id_contrato INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_plano INT NOT NULL,
    id_veiculo INT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    status ENUM('ATIVO', 'INATIVO', 'CANCELADO') NOT NULL,

    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_plano) REFERENCES plano_mensal(id_plano) ON DELETE RESTRICT,
    FOREIGN KEY (id_veiculo) REFERENCES veiculo(id_veiculo) ON DELETE CASCADE
);

-- Estrutura
DESCRIBE contrato_mensalista;

-- Consultas
SELECT * FROM contrato_mensalista;
SELECT c.id_contrato, u.nome, p.nome_plano, v.placa, c.status
FROM contrato_mensalista c
JOIN usuario u ON c.id_usuario = u.id_usuario
JOIN plano_mensal p ON c.id_plano = p.id_plano
JOIN veiculo v ON c.id_veiculo = v.id_veiculo;

-- Quantidade de contratos por status
SELECT status, COUNT(*) AS total FROM contrato_mensalista GROUP BY status;
