import createApp from "./app";
import { config } from "./config";

const app = createApp();

app.listen(config.PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${config.PORT}`);
    console.log(`📱 Acesse: http://localhost:${config.PORT}`);
})