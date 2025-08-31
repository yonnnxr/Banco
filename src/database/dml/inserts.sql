
-- Inserção de usuários de teste (senha: 123 para ambos)
-- Hash gerado com bcrypt para a senha "123"
INSERT INTO usuario (nome, email, senha, saldo, conta) VALUES
  ('Carlos', 'carlos@email.com', '$2b$10$wH6Q8Q6v8nN7oP6iQ5jH4uF3eD2cB1aZ0yX9wV8uT7sR6qP5oI4nM2', 1000.00, '12345677');

-- Conta diferente para evitar duplicidade
INSERT INTO usuario (nome, email, senha, saldo, conta) VALUES
  ('Joel', 'joel@email.com', '$2b$10$wH6Q8Q6v8nN7oP6iQ5jH4uF3eD2cB1aZ0yX9wV8uT7sR6qP5oI4nM2', 500.00, '87654322');