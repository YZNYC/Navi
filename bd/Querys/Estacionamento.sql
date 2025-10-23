-- Criação
CREATE TABLE estacionamento (
    id_estacionamento INT AUTO_INCREMENT PRIMARY KEY,
    id_proprietario INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,

    -- Endereço Detalhado
    cep VARCHAR(9) NOT NULL,       -- Formato 'XXXXX-XXX'
    rua VARCHAR(255) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    
    -- Coordenadas Geográficas
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(10, 8) NOT NULL,

    url_foto_principal VARCHAR(255),
    horario_abertura TIME,
    horario_fechamento TIME, 
    dias_funcionamento VARCHAR(100),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_proprietario) REFERENCES usuario(id_usuario)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
        
    -- Restrições de Unicidade
    UNIQUE KEY endereco_unico (cep, numero),    
    UNIQUE KEY localizacao_unica (latitude, longitude) 
);

-- Estrutura
DESCRIBE estacionamento;

-- Consultas
SELECT * FROM estacionamento;
SELECT nome, cnpj, endereco_completo FROM estacionamento;
SELECT COUNT(*) AS total_estacionamentos FROM estacionamento;

-- Buscar estacionamentos de um proprietário específico
SELECT e.nome, e.cnpj
FROM estacionamento e
JOIN usuario u ON e.id_proprietario = u.id_usuario
WHERE u.email = 'admin@navi.com';
