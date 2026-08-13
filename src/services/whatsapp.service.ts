import { io } from '../server';

export const sendWhatsAppMessage = async (phone: string, text: string): Promise<boolean> => {
    try {
        // En lugar de enviarlo a WAHA o Fontumi, lo empujamos directamente al Frontend Web UI!
        io.emit('bot_message', { phone, text });
        
        // Log en consola para tracking visual
        console.log(`[Respuesta IA a ${phone}]`);
        return true;
    } catch (error: any) {
        console.error(`[Error] Fallo al enviar a Chat UI:`, error);
        return false;
    }
};
