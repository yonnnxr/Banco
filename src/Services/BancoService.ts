import { NewUsers, LoginData, TransferData } from "../Model/UsuarioModel";
import { 
    DeleteUser, 
    findAllUser, 
    findUserById, 
    findUserByEmail,
    NewUser, 
    UpdateSaldo, 
    TransferirSaldo,
    getTransactions
} from "../repositories/BancoRepositories";
import { BadRequest, created, deleted, noContent, ok, unauthorized } from "../utils/httpHelper";
import { hashPassword, comparePassword, generateToken, generateAccountNumber } from "../utils/authHelper";

export const GetUsersService = async () => {
    const data = await findAllUser()

    if (data) {
        return await ok(data)
    } else {
        return await noContent()
    }
}

export const GetUsersById = async (id: number) => {
    const data = await findUserById(id)

    if (data) {
        return await ok(data)
    } else {
        return await noContent()
    }
}

export const NewUserService = async(user: NewUsers) => {
    if (user && user.nome && user.email && user.senha && user.saldo >= 0) {
        try {
            const existingUser = await findUserByEmail(user.email);
            if (existingUser) {
                return BadRequest('Email já cadastrado');
            }

            const conta = generateAccountNumber();
            
            const hashedPassword = await hashPassword(user.senha);
            
            await NewUser({ ...user, senha: hashedPassword }, conta);
            return created({ message: 'Usuário criado com sucesso', conta });
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            return BadRequest('Erro ao criar usuário');
        }
    } else {
        return BadRequest('Dados inválidos');
    }
}

export const LoginService = async(loginData: LoginData) => {
    if (!loginData.email || !loginData.senha) {
        return BadRequest('Email e senha são obrigatórios');
    }

    try {
        const user = await findUserByEmail(loginData.email);
        
        if (!user) {
            return unauthorized('Credenciais inválidas');
        }

        const isValidPassword = await comparePassword(loginData.senha, user.senha);
        
        if (!isValidPassword) {
            return unauthorized('Credenciais inválidas');
        }

        const token = generateToken(user.id, user.email);
        
        return ok({
            message: 'Login realizado com sucesso',
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                saldo: user.saldo,
                conta: user.conta
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        return BadRequest('Erro ao realizar login');
    }
}

export const DeleteUserByIdService = async(id: number) => {
    const data = await DeleteUser(id)

    if (data) {
        return deleted()
    } else {
        return noContent()
    }
}

export const UpdateSaldoService = async(id: number, saldo: number) => {
    const data = await UpdateSaldo(id, saldo)

    if (data) {
        return ok({ message: 'Saldo atualizado com sucesso', saldo })
    } else {
        return noContent()
    }
}

export const TransferirSaldoService = async(contaOrigem: string, transferData: TransferData) => {
    try {
        const { contaDestino, valor } = transferData;
        
        if (!contaDestino || !valor || valor <= 0) {
            return BadRequest('Dados de transferência inválidos');
        }

        if (contaOrigem === contaDestino) {
            return BadRequest('Não é possível transferir para a mesma conta');
        }

        const success = await TransferirSaldo(contaOrigem, contaDestino, valor);
        
        if (success) {
            return ok({ 
                message: 'Transferência realizada com sucesso',
                valor,
                contaDestino
            });
        } else {
            return BadRequest('Erro ao realizar transferência');
        }
    } catch (error: any) {
        console.error('Erro na transferência:', error);
        return BadRequest(error.message || 'Erro ao realizar transferência');
    }
}

export const GetTransactionsService = async(conta: string) => {
    try {
        const transactions = await getTransactions(conta);
        
        if (transactions && transactions.length > 0) {
            return ok(transactions);
        } else {
            return noContent();
        }
    } catch (error) {
        console.error('Erro ao buscar transações:', error);
        return BadRequest('Erro ao buscar transações');
    }
}