import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_BASE = 'https://services.leadconnectorhq.com';
const API_KEY = process.env.FONTUMI_API_KEY || '';
const LOCATION_ID = process.env.FONTUMI_LOCATION_ID || '';
const API_VERSION = '2021-07-28';

// Cliente HTTP reutilizable con los headers de autenticación
const api: AxiosInstance = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Version': API_VERSION,
    }
});

/**
 * Busca un contacto en Fontumi por teléfono.
 */
export const findContactByPhone = async (phone: string): Promise<any | null> => {
    try {
        const res = await api.get('/contacts/search', {
            params: { locationId: LOCATION_ID, query: phone, limit: 1 }
        });
        const contacts = res.data?.contacts || [];
        return contacts.length > 0 ? contacts[0] : null;
    } catch (error: any) {
        console.error('[Fontumi] Error buscando contacto:', error?.response?.data || error.message);
        return null;
    }
};

/**
 * Crea un contacto nuevo en Fontumi.
 */
export const createContact = async (phone: string, firstName: string = 'Turista'): Promise<any | null> => {
    try {
        const res = await api.post('/contacts/', {
            locationId: LOCATION_ID,
            phone: phone.startsWith('+') ? phone : `+${phone}`,
            firstName,
            tags: ['ecos-del-tiempo', 'hackaton-2026'],
            source: 'ecos-del-tiempo-bot'
        });
        console.log(`[Fontumi] Contacto creado: ${res.data?.contact?.id}`);
        return res.data?.contact || null;
    } catch (error: any) {
        console.error('[Fontumi] Error creando contacto:', error?.response?.data || error.message);
        return null;
    }
};

/**
 * Busca o crea un contacto — evita duplicados.
 */
export const findOrCreateContact = async (phone: string): Promise<any | null> => {
    let contact = await findContactByPhone(phone);
    if (!contact) {
        contact = await createContact(phone);
    }
    return contact;
};

/**
 * Busca una conversación existente para un contacto.
 */
export const findConversation = async (contactId: string): Promise<string | null> => {
    try {
        const res = await api.get('/conversations/search', {
            params: { locationId: LOCATION_ID, contactId }
        });
        const conversations = res.data?.conversations || [];
        return conversations.length > 0 ? conversations[0].id : null;
    } catch (error: any) {
        console.error('[Fontumi] Error buscando conversación:', error?.response?.data || error.message);
        return null;
    }
};

/**
 * Envía un mensaje de WhatsApp a través de Fontumi.
 */
export const sendWhatsAppMessage = async (phone: string, text: string, contactId?: string, conversationId?: string): Promise<boolean> => {
    try {
        console.log(`[Fontumi] Preparando mensaje para ${phone}...`);

        if (!API_KEY || !LOCATION_ID) {
            console.log(`\n======================================================`);
            console.log(`[CONSOLA - Sin Fontumi] Destino: ${phone}`);
            console.log(text);
            console.log(`======================================================\n`);
            return true;
        }

        // Si no nos pasaron contactId, buscamos o creamos el contacto
        if (!contactId) {
            const contact = await findOrCreateContact(phone);
            if (!contact) {
                console.error(`[Fontumi] No se pudo encontrar/crear contacto para ${phone}`);
                return false;
            }
            contactId = contact.id;
        }

        // Si no nos pasaron conversationId, buscamos una existente
        if (!conversationId) {
            conversationId = await findConversation(contactId!) || undefined;
        }

        // Enviar el mensaje
        const payload: any = {
            type: 'WhatsApp',
            contactId: contactId,
            message: text,
        };

        // Si encontramos conversación, la incluimos
        if (conversationId) {
            payload.conversationId = conversationId;
        }

        const res = await api.post('/conversations/messages', payload);
        console.log(`[Fontumi] ✅ Mensaje enviado a ${phone} (msgId: ${res.data?.messageId})`);
        return true;

    } catch (error: any) {
        console.error(`[Fontumi Error] Fallo enviando a ${phone}:`, error?.response?.data || error.message);
        
        // Fallback visual
        console.log(`\n======================================================`);
        console.log(`[WhatsApp - FALLBACK] Destino: ${phone}`);
        console.log(text);
        console.log(`======================================================\n`);
        return false;
    }
};
