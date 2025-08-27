# 🏦 Sistema Bancário Digital

Sistema bancário completo desenvolvido em Node.js, TypeScript e Express com interface web moderna e funcionalidades completas de autenticação, transferências e histórico de transações.

## ✨ Funcionalidades

### 🔐 **Autenticação e Segurança**
- Sistema de login/registro com JWT
- Hash de senhas com bcrypt
- Middleware de autenticação para rotas protegidas
- Tokens com expiração de 24h

### 💰 **Operações Bancárias**
- Visualização de saldo em tempo real
- Transferências entre contas
- Histórico completo de transações
- Números de conta únicos (8 dígitos)
- Validação de saldo antes de transferências

### 🎨 **Interface Moderna**
- Design responsivo (desktop, tablet, mobile)
- Tema limpo em preto e branco com acentos azuis
- Sistema de tabs para login/registro
- Dashboard intuitivo com informações da conta
- Ícones Lucide para melhor experiência visual
- Notificações em tempo real

### 🔧 **Tecnologias**
- **Backend**: Node.js, Express.js, TypeScript
- **Banco de Dados**: MySQL com XAMPP
- **Autenticação**: JWT, bcrypt
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Ícones**: Lucide Icons
- **Build**: tsup para TypeScript

## 🚀 Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+
- MySQL (XAMPP recomendado para macOS)
- npm ou yarn

### **1. Clone o repositório**
```bash
git clone <url-do-repositorio>
cd Banco
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto:
```bash
PORT=3333
JWT_SECRET=sua_chave_secreta_aqui_mude_em_producao
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=banco
DB_PORT=3306
```

### **4. Configure o banco de dados**
Execute no MySQL:
```sql
CREATE DATABASE banco;
USE banco;

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    saldo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    conta VARCHAR(8) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE transacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('deposito', 'saque', 'transferencia') NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    conta_origem VARCHAR(8) NOT NULL,
    conta_destino VARCHAR(8),
    descricao TEXT,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conta_origem) REFERENCES usuario(conta),
    FOREIGN KEY (conta_destino) REFERENCES usuario(conta)
);

CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_usuario_conta ON usuario(conta);
CREATE INDEX idx_transacoes_conta_origem ON transacoes(conta_origem);
CREATE INDEX idx_transacoes_conta_destino ON transacoes(conta_destino);
CREATE INDEX idx_transacoes_data ON transacoes(data);
```

### **5. Execute o sistema**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Build do frontend
npm run build:frontend
```

### **6. Acesse a aplicação**
- **Interface Web**: http://localhost:3333
- **API**: http://localhost:3333/usuarios

## 📡 API Endpoints

### **Rotas Públicas**
- `POST /auth/register` - Criar nova conta
- `POST /auth/login` - Fazer login
- `GET /usuarios` - Listar usuários
- `GET /usuarios/:id` - Buscar usuário por ID

### **Rotas Protegidas (JWT)**
- `GET /profile` - Perfil do usuário logado
- `GET /transactions` - Histórico de transações
- `POST /transfer` - Realizar transferência
- `PATCH /usuarios/:id/saldo` - Atualizar saldo
- `DELETE /usuarios/:id` - Deletar usuário

## 🧪 Testando o Sistema

### **Usuário de Teste**
```
Email: teste@email.com
Senha: 123456
Conta: 74194415
```

### **Criar Novo Usuário**
```bash
curl -X POST http://localhost:3333/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@email.com","senha":"123456","saldo":100.00}'
```

### **Fazer Login**
```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","senha":"123456"}'
```

### **Realizar Transferência**
```bash
curl -X POST http://localhost:3333/transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{"contaDestino":"12345678","valor":25.50}'
```

## 🏗️ Estrutura do Projeto

```
src/
├── Controller/          # Controladores da API
├── Services/            # Lógica de negócio
├── repositories/        # Acesso ao banco de dados
├── Model/              # Modelos de dados
├── middleware/          # Middlewares (auth)
├── utils/              # Utilitários (HTTP, auth)
├── database/           # Configuração do banco
├── public/             # Frontend (HTML, CSS, JS)
└── config/             # Configurações
```

## 🔒 Segurança

- **Senhas**: Hash com bcrypt (10 rounds)
- **JWT**: Tokens com expiração de 24h
- **Validação**: Dados validados em todas as rotas
- **Transações**: Rollback automático em caso de erro
- **Middleware**: Autenticação obrigatória para rotas protegidas

## 📱 Responsividade

A interface é totalmente responsiva:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: até 767px

## 🎯 Funcionalidades Implementadas

- ✅ Sistema de autenticação completo
- ✅ Transferências entre contas
- ✅ Histórico de transações
- ✅ Interface responsiva
- ✅ Validações de segurança
- ✅ Tratamento de erros
- ✅ Ícones Lucide
- ✅ Sistema de notificações
- ✅ Persistência de sessão

## 🚧 Próximas Funcionalidades

- [ ] Autenticação 2FA
- [ ] Histórico com filtros avançados
- [ ] Transferências agendadas
- [ ] Relatórios e estatísticas
- [ ] Exportação de dados
- [ ] Temas personalizáveis
- [ ] Notificações push
- [ ] Rate limiting

## 🐛 Solução de Problemas

### **Erro de Conexão Recusada**
- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo .env
- Verifique se o banco 'banco' existe

### **Erro de Porta em Uso**
- Mude a porta no arquivo .env
- Pare outros serviços usando a porta 3333

### **Erro de Módulo Não Encontrado**
- Execute `npm install` novamente
- Verifique se todas as dependências estão instaladas

### **Erro de JWT**
- Verifique se a variável JWT_SECRET está definida
- Use uma chave secreta forte em produção

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

---

**Desenvolvido com ❤️ para demonstrar um sistema bancário completo e funcional.**
