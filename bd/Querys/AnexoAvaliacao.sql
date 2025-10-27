-- Criação
CREATE TABLE IF NOT EXISTS anexo_avaliacao (
    id_anexo INT AUTO_INCREMENT PRIMARY KEY,
    id_avaliacao INT NOT NULL,
    tipo_anexo ENUM('IMAGEM', 'VIDEO') DEFAULT 'IMAGEM',
    url_anexo VARCHAR(255) NOT NULL,

    FOREIGN KEY (id_avaliacao) REFERENCES avaliacao(id_avaliacao) ON DELETE CASCADE
);

-- Estrutura
DESCRIBE anexo_avaliacao;

-- Consultas
SELECT * FROM anexo_avaliacao;
SELECT id_anexo, id_avaliacao, tipo_anexo, url_anexo FROM anexo_avaliacao;
