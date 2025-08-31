import express, {json} from "express";
import router from "./routes";
import cors from "cors";
import path from "path";

function CreateServer() {
    const app = express()
    
    app.use(json())
    app.use(cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }))
    
    app.use(express.static(path.join(__dirname, 'public')))
    
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'))
    })
    
    app.use("/", router)

    return app
}

export default CreateServer