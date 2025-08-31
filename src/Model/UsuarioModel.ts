export interface Usuario {
    id: number,
    nome: string,
    email: string,
    senha: string,
    saldo: number,
    conta: string,
    created_at: Date
}

export interface NewUsers {
    nome: string,
    email: string,
    senha: string,
    saldo: number
}

export interface LoginData {
    email: string,
    senha: string
}

export interface TransferData {
    contaDestino: string,
    valor: number
}

export interface Transaction {
    id: number,
    tipo: 'deposito' | 'saque' | 'transferencia',
    valor: number,
    contaOrigem: string,
    contaDestino?: string,
    descricao: string,
    data: Date,
    isOutgoing?: boolean
}