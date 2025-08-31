-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS banco;
USE banco;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    saldo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    conta VARCHAR(8) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de transações
CREATE TABLE IF NOT EXISTS transacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('deposito', 'saque', 'transferencia', 'recebimento') NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    conta_origem VARCHAR(8) NOT NULL,
    conta_destino VARCHAR(8),
    descricao TEXT,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conta_origem) REFERENCES usuario(conta),
    FOREIGN KEY (conta_destino) REFERENCES usuario(conta)
);

-- Índices para melhor performance
CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_usuario_conta ON usuario(conta);
CREATE INDEX idx_transacoes_conta_origem ON transacoes(conta_origem);
CREATE INDEX idx_transacoes_conta_destino ON transacoes(conta_destino);
CREATE INDEX idx_transacoes_data ON transacoes(data);
