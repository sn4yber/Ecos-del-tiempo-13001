"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWhatsAppWebhook = void 0;
const conversation_service_1 = require("../services/conversation.service");
const handleWhatsAppWebhook = async (req, res) => {
    try {
        console.log('--- Incoming Webhook ---');
        let phone = '';
        let text = '';
        const body = req.body;
        // Fontumi Webhook format
        if (body?.type === 'InboundMessage' || body?.message) {
            phone = body.contactId || body.from || body.phone || '';
            text = body.message || body.body || body.text || '';
        }
        // Formato genérico / pruebas con curl
        else if (body?.payload) {
            const payload = body.payload;
            if (payload.fromMe) {
                res.status(200).send('IGNORED');
                return;
            }
            // Ignorar grupos y sistema
            const from = payload.from || '';
            if (from.includes('@g.us') || from.includes('@lid')) {
                res.status(200).send('IGNORED');
                return;
            }
            phone = from.replace('@c.us', '');
            text = payload.body || '';
        }
        // Fallback directo
        else {
            phone = body?.from || body?.phone || body?.contactId || '';
            text = body?.text || body?.message || body?.body || '';
        }
        if (phone && text) {
            const messageText = typeof text === 'string' ? text : JSON.stringify(text);
            (0, conversation_service_1.processIncomingMessage)(String(phone), messageText)
                .catch(err => console.error('[Error] Fallo procesando mensaje:', err));
        }
        else {
            console.warn('[Webhook] Payload sin teléfono o texto válido.', body);
        }
        res.status(200).send('OK');
    }
    catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).send('Internal Server Error');
    }
};
exports.handleWhatsAppWebhook = handleWhatsAppWebhook;
