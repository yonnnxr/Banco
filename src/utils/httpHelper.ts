import { httpResponse } from "../Model/httpResponseModel"

export const ok = async (data?: any): Promise<httpResponse> => {
    return {
        statusCode: 200,
        body: data || { message: "Sucesso!" }
    }
}

export const noContent = async (): Promise<httpResponse> => {
    return {
        statusCode: 204,
        body: null  
    }
}

export const BadRequest = async (message?: string): Promise<httpResponse> => {
    return {
        statusCode: 400,
        body: {
            error: "Bad Request",
            message: message || "Dados inválidos"
        }
    }
}

export const created = async (data?: any): Promise<httpResponse> => {
    return {
        statusCode: 201,
        body: data || { message: "Criado com sucesso!" }
    }
}

export const deleted = async (data?: any): Promise<httpResponse> => {
    return {
        statusCode: 200,
        body: data || { message: "Deletado com sucesso" }
    }
}

export const unauthorized = async (message?: string): Promise<httpResponse> => {
    return {
        statusCode: 401,
        body: {
            error: "Unauthorized",
            message: message || "Acesso negado"
        }
    }
}

export const notFound = async (message?: string): Promise<httpResponse> => {
    return {
        statusCode: 404,
        body: {
            error: "Not Found",
            message: message || "Recurso não encontrado"
        }
    }
}

export const internalServerError = async (message?: string): Promise<httpResponse> => {
    return {
        statusCode: 500,
        body: {
            error: "Internal Server Error",
            message: message || "Erro interno do servidor"
        }
    }
}