import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhook.routes';
import path from 'path';
import { processIncomingMessage } from './services/conversation.service';

dotenv.config();

export const app = express();
export const httpServer = createServer(app);
export const io = new Server(httpServer, {
    cors: { origin: '*' }
});

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/favicon.svg'));
});

app.use(express.static(path.join(__dirname, '../public')));

// Existing Webhooks
app.use('/webhook', webhookRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'ecos-del-tiempo-api' });
});

// Web Chat Socket Connection
io.on('connection', (socket) => {
    console.log('[Socket.io] Nuevo cliente de chat conectado:', socket.id);

    socket.on('user_message', async (data) => {
        const { phone, text } = data;
        console.log(`[Chat Web UI] Turista ${phone} dice: ${text}`);
        
        try {
            // Conectar la interfaz gráfica directo al cerebro del bot!
            await processIncomingMessage(phone, text);
        } catch (error) {
            console.error('[Socket.io Error]', error);
        }
    });
});

httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`✅ Servidor backend y Web Chat listos`);
    console.log(`👉 ABRE EN TU NAVEGADOR PARA LA PRESENTACIÓN: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
});
