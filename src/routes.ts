import { Router } from "express"
import {
    GetClubs,
    getUserById,
    postUsers,
    DeleteUsers,
    UpdateSaldo,
    login,
    transferirSaldo,
    getTransactions,
    getProfile
} from "./Controller/BancoController"
import { authMiddleware } from "./middleware/auth"

const router = Router()

router.post("/auth/register", postUsers)
router.post("/auth/login", login)
router.get("/usuarios", GetClubs)
router.get("/usuarios/:id", getUserById)

router.use(authMiddleware)

router.get("/profile", getProfile)
router.get("/transactions", getTransactions)
router.post("/transfer", transferirSaldo)
router.patch("/usuarios/:id/saldo", UpdateSaldo)
router.delete("/usuarios/:id", DeleteUsers)

export default router