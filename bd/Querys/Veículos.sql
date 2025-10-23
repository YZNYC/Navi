-- Criação
CREATE TABLE IF NOT EXISTS veiculo (
    id_veiculo INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    placa VARCHAR(10) NOT NULL UNIQUE,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    cor VARCHAR(30) NOT NULL,
    url_foto_placa VARCHAR(255),
    apelido VARCHAR(50),
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Estrutura
DESCRIBE veiculo;

-- Consultas
SELECT * FROM veiculo;
SELECT placa, modelo, cor FROM veiculo WHERE ativo = TRUE;
SELECT COUNT(*) AS total_veiculos, id_usuario FROM veiculo GROUP BY id_usuario;
