-- =================================================================================
-- Tabela de mensagens: Para conversas entre o sistema.
-- =================================================================================
CREATE TABLE mensagem (
    id_mensagem INT AUTO_INCREMENT PRIMARY KEY,
    id_remetente INT NOT NULL,
    id_destinatario INT NOT NULL,
    conteudo TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lida BOOLEAN DEFAULT FALSE,
    foi_editada BOOLEAN DEFAULT FALSE,
    reply_to INT NULL,
    
    FOREIGN KEY (id_remetente) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_destinatario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (reply_to) REFERENCES mensagem(id_mensagem) ON DELETE SET NULL
);