"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.httpServer = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const webhook_routes_1 = __importDefault(require("./routes/webhook.routes"));
const path_1 = __importDefault(require("path"));
const conversation_service_1 = require("./services/conversation.service");
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.httpServer = (0, http_1.createServer)(exports.app);
exports.io = new socket_io_1.Server(exports.httpServer, {
    cors: { origin: '*' }
});
const PORT = process.env.PORT || 3001;
exports.app.use(express_1.default.json());
exports.app.get('/favicon.ico', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/favicon.svg'));
});
exports.app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Existing Webhooks
exports.app.use('/webhook', webhook_routes_1.default);
exports.app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'ecos-del-tiempo-api' });
});
// Web Chat Socket Connection
exports.io.on('connection', (socket) => {
    console.log('[Socket.io] Nuevo cliente de chat conectado:', socket.id);
    socket.on('user_message', async (data) => {
        const { phone, text } = data;
        console.log(`[Chat Web UI] Turista ${phone} dice: ${text}`);
        try {
            // Conectar la interfaz gráfica directo al cerebro del bot!
            await (0, conversation_service_1.processIncomingMessage)(phone, text);
        }
        catch (error) {
            console.error('[Socket.io Error]', error);
        }
    });
});
exports.httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`✅ Servidor backend y Web Chat listos`);
    console.log(`👉 ABRE EN TU NAVEGADOR PARA LA PRESENTACIÓN: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
});
