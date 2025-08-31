import { Request, Response } from "express";
import {
    DeleteUserByIdService,
    GetUsersById,
    GetUsersService,
    NewUserService,
    UpdateSaldoService,
    LoginService,
    TransferirSaldoService,
    GetTransactionsService
} from "../Services/BancoService";
import { AuthRequest } from "../middleware/auth";

export const GetClubs = async (req: Request, res: Response) => {
    const httpResponse = await GetUsersService();
    res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const getUserById = async (req: Request, res: Response) => {
    const idParam = req.params["id"];
    if (!idParam) {
        return res.status(400).json({
            error: "Parâmetro 'id' não fornecido",
            message: "Informe o id do usuário"
        });
    }
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
        return res.status(400).json({
            error: "Parâmetro 'id' inválido",
            message: "O id do usuário deve ser um número"
        });
    }
    const httpResponse = await GetUsersById(id);
    res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const postUsers = async (req: Request, res: Response) => {
    const BodyValue = req.body;
    const httpResponse = await NewUserService(BodyValue);
    res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const login = async (req: Request, res: Response) => {
    const loginData = req.body;
    const httpResponse = await LoginService(loginData);
    res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const DeleteUsers = async (req: AuthRequest, res: Response) => {
    const idParam = req.params["id"];
    if (!idParam) {
        return res.status(400).json({
            error: "Parâmetro 'id' não fornecido",
            message: "Informe o id do usuário"
        });
    }
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
        return res.status(400).json({
            error: "Parâmetro 'id' inválido",
            message: "O id do usuário deve ser um número"
        });
    }
    const httpResponse = await DeleteUserByIdService(id);
    res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const UpdateSaldo = async (req: AuthRequest, res: Response) => {
    const idParam = req.params["id"];
    if (!idParam) {
        return res.status(400).json({
            error: "Parâmetro 'id' não fornecido",
            message: "Informe o id do usuário"
        });
    }
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
        return res.status(400).json({
            error: "Parâmetro 'id' inválido",
            message: "O id do usuário deve ser um número"
        });
    }
    const { saldo } = req.body;
    if (typeof saldo !== "number" || isNaN(saldo)) {
        return res.status(400).json({
            error: "Saldo inválido",
            message: "O saldo deve ser um número"
        });
    }
    const httpResponse = await UpdateSaldoService(id, saldo);
    res.status(httpResponse.statusCode).json(httpResponse.body);
};

export const transferirSaldo = async (req: AuthRequest, res: Response) => {
    try {
        const contaOrigem = req.user?.conta || "";
        const transferData = req.body;

        if (!contaOrigem) {
            return res.status(400).json({
                error: "Usuário não autenticado",
                message: "Faça login para continuar"
            });
        }

        const httpResponse = await TransferirSaldoService(contaOrigem, transferData);
        res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (error) {
        console.error("Erro na transferência:", error);
        res.status(500).json({
            error: "Erro interno do servidor",
            message: "Erro ao processar transferência"
        });
    }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
    try {
        const conta = req.user?.conta || "";

        if (!conta) {
            return res.status(400).json({
                error: "Usuário não autenticado",
                message: "Faça login para continuar"
            });
        }

        const httpResponse = await GetTransactionsService(conta);
        res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (error) {
        console.error("Erro ao buscar transações:", error);
        res.status(500).json({
            error: "Erro interno do servidor",
            message: "Erro ao buscar transações"
        });
    }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({
                error: "Usuário não autenticado",
                message: "Faça login para continuar"
            });
        }

        const httpResponse = await GetUsersById(userId);
        res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        res.status(500).json({
            error: "Erro interno do servidor",
            message: "Erro ao buscar perfil"
        });
    }
};