const API_BASE_URL = 'http://localhost:3333';

let currentUser = null;
let authToken = null;

const authSection = document.getElementById('authSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const transferForm = document.getElementById('transferForm');
const notificationModal = document.getElementById('notificationModal');
const modalMessage = document.getElementById('modalMessage');
const closeModal = document.querySelector('.close');

const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userAccount = document.getElementById('userAccount');
const userBalance = document.getElementById('userBalance');
const transactionsList = document.getElementById('transactionsList');

document.addEventListener('DOMContentLoaded', function() {
    setupFormListeners();
    setupModalListeners();
    checkAuthStatus();
});

function setupFormListeners() {
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    transferForm.addEventListener('submit', handleTransfer);
}

function setupModalListeners() {
    closeModal.addEventListener('click', closeNotificationModal);
    window.addEventListener('click', function(event) {
        if (event.target === notificationModal) {
            closeNotificationModal();
        }
    });
}

async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(loginForm);
    const loginData = {
        email: formData.get('email').trim(),
        senha: formData.get('senha')
    };
    
    if (!loginData.email || !loginData.senha) {
        showNotification('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showNotification('Login realizado com sucesso!', 'success');
            showDashboard();
            loadUserProfile();
            loadTransactions();
        } else {
            showNotification('Erro no login: ' + (data.message || 'Credenciais inválidas'), 'error');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        showNotification('Erro de conexão ao fazer login', 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(registerForm);
    const userData = {
        nome: formData.get('nome').trim(),
        email: formData.get('email').trim(),
        senha: formData.get('senha'),
        saldo: parseFloat(formData.get('saldo'))
    };
    
    if (!userData.nome || !userData.email || !userData.senha || isNaN(userData.saldo)) {
        showNotification('Por favor, preencha todos os campos corretamente', 'error');
        return;
    }
    
    if (userData.senha.length < 6) {
        showNotification('A senha deve ter pelo menos 6 caracteres', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification(`Conta criada com sucesso! Sua conta é: ${data.conta}`, 'success');
            registerForm.reset();
            showTab('login');
        } else {
            showNotification('Erro ao criar conta: ' + (data.message || 'Erro desconhecido'), 'error');
        }
    } catch (error) {
        console.error('Erro ao criar conta:', error);
        showNotification('Erro de conexão ao criar conta', 'error');
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    showAuthSection();
    showNotification('Logout realizado com sucesso!', 'success');
}

function checkAuthStatus() {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
        showDashboard();
        loadUserProfile();
        loadTransactions();
    }
}

function showTab(tabName) {
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const targetTab = document.getElementById(`${tabName}Tab`);
    const targetBtn = event?.target;
    
    if (targetTab) targetTab.classList.add('active');
    if (targetBtn) targetBtn.classList.add('active');
}

function showAuthSection() {
    authSection.style.display = 'block';
    dashboardSection.style.display = 'none';
}

function showDashboard() {
    authSection.style.display = 'none';
    dashboardSection.style.display = 'block';
}

async function loadUserProfile() {
    if (!authToken) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            updateUserInfo(data);
        } else {
            console.error('Erro ao carregar perfil:', data);
        }
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
    }
}

function updateUserInfo(user) {
    userName.textContent = user.nome;
    userEmail.innerHTML = `<i data-lucide="mail" class="detail-icon"></i>${user.email}`;
    userAccount.innerHTML = `<i data-lucide="credit-card" class="detail-icon"></i>Conta: ${user.conta}`;
    
    const saldo = typeof user.saldo === 'string' ? parseFloat(user.saldo) : user.saldo;
    userBalance.textContent = `R$ ${saldo.toFixed(2)}`;
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

async function handleTransfer(event) {
    event.preventDefault();
    
    if (!currentUser || !authToken) {
        showNotification('Usuário não autenticado', 'error');
        return;
    }
    
    const formData = new FormData(transferForm);
    const transferData = {
        contaDestino: formData.get('contaDestino').trim(),
        valor: parseFloat(formData.get('valor'))
    };
    
    if (!transferData.contaDestino || isNaN(transferData.valor) || transferData.valor <= 0) {
        showNotification('Por favor, preencha todos os campos corretamente', 'error');
        return;
    }
    
    if (transferData.contaDestino === currentUser.conta) {
        showNotification('Não é possível transferir para a mesma conta', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/transfer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(transferData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Transferência realizada com sucesso!', 'success');
            transferForm.reset();
            loadUserProfile();
            loadTransactions();
        } else {
            showNotification('Erro na transferência: ' + (data.message || 'Erro desconhecido'), 'error');
        }
    } catch (error) {
        console.error('Erro na transferência:', error);
        showNotification('Erro de conexão ao realizar transferência', 'error');
    }
}

async function loadTransactions() {
    if (!authToken) return;
    
    try {
        showLoading(transactionsList);
        
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.status === 204) {
            displayTransactions([]);
            return;
        }
        
        if (!response.ok) {
            showError('Erro ao carregar transações: ' + response.statusText);
            return;
        }
        
        const data = await response.json();
        displayTransactions(data);
    } catch (error) {
        console.error('Erro ao carregar transações:', error);
        showError('Erro de conexão ao carregar transações');
    }
}

function displayTransactions(transactions) {
    if (!transactions || transactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="no-transactions">
                <i data-lucide="inbox" class="no-transactions-icon"></i>
                <h3>Nenhuma transação encontrada</h3>
                <p>Você ainda não realizou nenhuma operação bancária.</p>
                <p>Faça uma transferência para começar a ver seu histórico!</p>
            </div>
        `;
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
        return;
    }
    
    if (!currentUser) return;
    
    transactionsList.innerHTML = transactions.map(transaction => {
        let isPositive = false;
        let isNegative = false;
        let amountPrefix = '';
        let amountClass = '';
        
        if (transaction.tipo === 'transferencia') {
            if (transaction.conta_origem === currentUser.conta) {
                isNegative = true;
                amountPrefix = '-';
                amountClass = 'negative';
            } else if (transaction.conta_destino === currentUser.conta) {
                isPositive = true;
                amountPrefix = '+';
                amountClass = 'positive';
            }
        } else if (transaction.tipo === 'deposito') {
            isPositive = true;
            amountPrefix = '+';
            amountClass = 'positive';
        } else if (transaction.tipo === 'saque') {
            isNegative = true;
            amountPrefix = '-';
            amountClass = 'negative';
        }
        
        const valor = typeof transaction.valor === 'string' ? parseFloat(transaction.valor) : transaction.valor;
        
        return `
            <div class="transaction-item">
                <div class="transaction-header">
                    <span class="transaction-type">${getTransactionTypeLabel(transaction.tipo, transaction.conta_origem === currentUser.conta)}</span>
                    <span class="transaction-amount ${amountClass}">
                        ${amountPrefix}R$ ${valor.toFixed(2)}
                    </span>
                </div>
                <div class="transaction-details">
                    ${transaction.descricao}
                </div>
                <div class="transaction-date">
                    ${new Date(transaction.data).toLocaleString('pt-BR')}
                </div>
            </div>
        `;
    }).join('');
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function getTransactionTypeLabel(tipo, isOutgoing = false) {
    if (tipo === 'transferencia') {
        return isOutgoing ? '📤 Transferência Enviada' : '📥 Transferência Recebida';
    }
    
    const labels = {
        'deposito': '💰 Depósito',
        'saque': '💸 Saque'
    };
    return labels[tipo] || tipo;
}

function showLoading(element) {
    element.innerHTML = '<div class="loading"><i data-lucide="loader-2" class="loading-icon"></i> Carregando...</div>';
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function showNotification(message, type = 'info') {
    modalMessage.innerHTML = `
        <div class="notification ${type}">
            <h3>${type === 'success' ? '✅ Sucesso' : type === 'error' ? '❌ Erro' : 'ℹ️ Informação'}</h3>
            <p>${message}</p>
        </div>
    `;
    
    notificationModal.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            closeNotificationModal();
        }, 3000);
    }
}

function closeNotificationModal() {
    notificationModal.style.display = 'none';
}

function showError(message) {
    transactionsList.innerHTML = `<div class="error">❌ ${message}</div>`;
}

const style = document.createElement('style');
style.textContent = `
    .notification {
        text-align: center;
    }
    
    .notification h3 {
        margin-bottom: 15px;
        color: #2c3e50;
    }
    
    .notification.success h3 {
        color: #27ae60;
    }
    
    .notification.error h3 {
        color: #e74c3c;
    }
    
    .no-transactions {
        text-align: center;
        color: #6c757d;
        font-style: italic;
        padding: 40px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 2px dashed #dee2e6;
    }
    
    .error {
        text-align: center;
        color: #e74c3c;
        padding: 40px;
        background: #fdf2f2;
        border-radius: 8px;
        border: 2px solid #fecaca;
    }
`;
document.head.appendChild(style);

