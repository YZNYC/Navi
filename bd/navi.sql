DROP DATABASE navi;
CREATE DATABASE navi;
USE navi;

CREATE TABLE estacionamento (
id_estacionamento INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(255) NOT NULL,
endereço VARCHAR(150),
tarifas DECIMAL(10,2),
horarios TIMESTAMP
);
insert into estacionamento (id_estacionamento, nome)
values (23, "Park1"),
(24, "Park2"),
(25, "Park3");

CREATE TABLE vagas (
id_vaga INT AUTO_INCREMENT PRIMARY KEY,
id_estacionamento INT NOT NULL,
numero INT NOT NULL,
status ENUM('livre', 'ocupada') DEFAULT 'livre',
FOREIGN KEY (id_estacionamento) REFERENCES estacionamento (id_estacionamento)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);
select * from vagas;
DELETE FROM vagas WHERE id_vaga = 5;

CREATE TABLE usuario (
id_usuario INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(255) NOT NULL,
email VARCHAR(300) NOT NULL,
senha VARCHAR(12) NOT NULL,
papel ENUM('dono', 'motorista', 'ADM') 
);

CREATE TABLE log (
id_log INT AUTO_INCREMENT PRIMARY KEY,
id_usuario INT NOT NULL,
acao ENUM('CRIACAO_ESTACIONAMENTO', 'RESERVA', 'PAGAMENTO') NOT NULL,
descricao TEXT,
data_log TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
);

CREATE TABLE reserva (
id_reserva INT AUTO_INCREMENT PRIMARY KEY,
id_usuario INT NOT NULL,
id_vaga INT NOT NULL,
data_hora_inicio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
data_hora_fim TIMESTAMP NULL,
status ENUM('reservado', 'aguardando pagamento', 'cancelado'),
FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
FOREIGN KEY (id_vaga) REFERENCES vagas(id_vaga)
);

CREATE TABLE pagamento (
id_pagamento INT AUTO_INCREMENT PRIMARY KEY,
id_reserva INT NOT NULL,
valor decimal (10,2),
metodo ENUM('pix', 'debito', 'credito'),
data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

#-----------------------------------------------------------------------------------
#ideias ou mudanças futuras
/*
CREATE TABLE avaliacao (
id_avalicao INT AUTO_INCREMENT PRIMARY KEY,
id_usuario INT NOT NULL,
data_postado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
comentário VARCHAR(500),
FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)

*/

#------------------------------------------------------------------------------------