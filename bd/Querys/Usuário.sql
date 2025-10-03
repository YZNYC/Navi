-- Criação
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    url_foto_perfil VARCHAR(255),
    papel ENUM('ADMINISTRADOR', 'PROPRIETARIO', 'MOTORISTA') NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insere exemplo
INSERT INTO usuario (nome, email, senha, telefone, papel)
VALUES ('Admin', 'admin@navi.com', '123456', '11999999999', 'ADMINISTRADOR');

-- Ver estrutura
DESCRIBE usuario;

-- Consultas úteis
SELECT * FROM usuario;
SELECT id_usuario, nome, email, papel FROM usuario WHERE papel = 'PROPRIETARIO';
SELECT COUNT(*) AS total_usuarios FROM usuario;
