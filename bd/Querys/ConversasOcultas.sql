CREATE TABLE conversa_oculta (
    id_usuario INT NOT NULL,        
    id_parceiro_chat INT NOT NULL, 
    
    PRIMARY KEY (id_usuario, id_parceiro_chat), -- Garante que a relação seja única.

    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_parceiro_chat) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);