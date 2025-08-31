import { NewUsers, Usuario, Transaction } from "../Model/UsuarioModel";
import pool from "../database/database";

export const findAllUser = async (): Promise<Usuario[]> => {
    const [rows] = await pool.query<any>("SELECT id, nome, email, saldo, conta, created_at FROM usuario");
    return rows as Usuario[];
}

export const findUserById = async (id: number): Promise<Usuario | undefined> => {
    const [rows] = await pool.query<any>("SELECT id, nome, email, saldo, conta, created_at FROM usuario WHERE id = ?", [id]);
    return rows[0] as Usuario;
}

export const findUserByEmail = async (email: string): Promise<Usuario | undefined> => {
    const [rows] = await pool.query<any>("SELECT * FROM usuario WHERE email = ?", [email]);
    return rows[0] as Usuario;
}

export const findUserByAccount = async (conta: string): Promise<Usuario | undefined> => {
    const [rows] = await pool.query<any>("SELECT id, nome, email, saldo, conta, created_at FROM usuario WHERE conta = ?", [conta]);
    return rows[0] as Usuario;
}

export const NewUser = async (user: NewUsers, conta: string): Promise<any> => {
    const [resultado] = await pool.query<any>(
        "INSERT INTO usuario (nome, email, senha, saldo, conta, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
        [user.nome, user.email, user.senha, user.saldo, conta]
    );
    return resultado;
}

export const DeleteUser = async (id: number): Promise<boolean> => {
    const [result]: any = await pool.query(
        "DELETE FROM usuario WHERE id = ?",
        [id]
    );
    return result.affectedRows > 0;
}

export const UpdateSaldo = async (id: number, novoSaldo: number): Promise<boolean> => {
    const [result]: any = await pool.query(
        "UPDATE usuario SET saldo = ? WHERE id = ?",
        [novoSaldo, id]
    );
    return result.affectedRows > 0;
}

export const TransferirSaldo = async (contaOrigem: string, contaDestino: string, valor: number): Promise<boolean> => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const [contaOrigemData] = await connection.query<any>(
            "SELECT id, saldo FROM usuario WHERE conta = ? FOR UPDATE",
            [contaOrigem]
        );
        
        const [contaDestinoData] = await connection.query<any>(
            "SELECT id FROM usuario WHERE conta = ? FOR UPDATE",
            [contaDestino]
        );
        
        if (!contaOrigemData[0] || !contaDestinoData[0]) {
            throw new Error('Conta origem ou destino não encontrada');
        }
        
        if (contaOrigemData[0].saldo < valor) {
            throw new Error('Saldo insuficiente para transferência');
        }
        
        await connection.query(
            "UPDATE usuario SET saldo = saldo - ? WHERE conta = ?",
            [valor, contaOrigem]
        );
        
        await connection.query(
            "UPDATE usuario SET saldo = saldo + ? WHERE conta = ?",
            [valor, contaDestino]
        );
        
        await connection.query(
            "INSERT INTO transacoes (tipo, valor, conta_origem, conta_destino, descricao, data) VALUES (?, ?, ?, ?, ?, NOW())",
            ['transferencia', valor, contaOrigem, contaDestino, `Transferência de ${contaOrigem} para ${contaDestino}`]
        );
        
        await connection.commit();
        return true;
        
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

export const getTransactions = async (conta: string): Promise<Transaction[]> => {
    const [rows] = await pool.query<any>(
        `SELECT 
            id, 
            tipo, 
            valor, 
            conta_origem, 
            conta_destino, 
            descricao, 
            data 
        FROM transacoes 
        WHERE conta_origem = ? OR conta_destino = ? 
        ORDER BY data DESC`,
        [conta, conta]
    );
    
    const transactions = rows.map((row: any) => {
        const isOutgoing = row.conta_origem === conta;
        const isIncoming = row.conta_destino === conta;
        
        if (row.tipo === 'transferencia') {
            if (isOutgoing) {
                return {
                    ...row,
                    tipo: 'transferencia',
                    descricao: `Transferência enviada para ${row.conta_destino}`,
                    isOutgoing: true
                };
            } else if (isIncoming) {
                return {
                    ...row,
                    tipo: 'recebimento',
                    descricao: `Transferência recebida de ${row.conta_origem}`,
                    isOutgoing: false
                };
            }
        }
        
        return {
            ...row,
            isOutgoing: row.tipo === 'saque'
        };
    });
    
    return transactions as Transaction[];
}