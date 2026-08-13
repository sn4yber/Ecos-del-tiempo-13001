"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsAppMessage = void 0;
const server_1 = require("../server");
const sendWhatsAppMessage = async (phone, text) => {
    try {
        // En lugar de enviarlo a WAHA o Fontumi, lo empujamos directamente al Frontend Web UI!
        server_1.io.emit('bot_message', { phone, text });
        // Log en consola para tracking visual
        console.log(`[Respuesta IA a ${phone}]`);
        return true;
    }
    catch (error) {
        console.error(`[Error] Fallo al enviar a Chat UI:`, error);
        return false;
    }
};
exports.sendWhatsAppMessage = sendWhatsAppMessage;
