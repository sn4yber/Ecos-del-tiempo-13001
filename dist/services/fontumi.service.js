"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsAppMessage = exports.findConversation = exports.findOrCreateContact = exports.createContact = exports.findContactByPhone = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const API_BASE = 'https://services.leadconnectorhq.com';
const API_KEY = process.env.FONTUMI_API_KEY || '';
const LOCATION_ID = process.env.FONTUMI_LOCATION_ID || '';
const API_VERSION = '2021-07-28';
// Cliente HTTP reutilizable con los headers de autenticación
const api = axios_1.default.create({
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
const findContactByPhone = async (phone) => {
    try {
        const res = await api.get('/contacts/search', {
            params: { locationId: LOCATION_ID, query: phone, limit: 1 }
        });
        const contacts = res.data?.contacts || [];
        return contacts.length > 0 ? contacts[0] : null;
    }
    catch (error) {
        console.error('[Fontumi] Error buscando contacto:', error?.response?.data || error.message);
        return null;
    }
};
exports.findContactByPhone = findContactByPhone;
/**
 * Crea un contacto nuevo en Fontumi.
 */
const createContact = async (phone, firstName = 'Turista') => {
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
    }
    catch (error) {
        console.error('[Fontumi] Error creando contacto:', error?.response?.data || error.message);
        return null;
    }
};
exports.createContact = createContact;
/**
 * Busca o crea un contacto — evita duplicados.
 */
const findOrCreateContact = async (phone) => {
    let contact = await (0, exports.findContactByPhone)(phone);
    if (!contact) {
        contact = await (0, exports.createContact)(phone);
    }
    return contact;
};
exports.findOrCreateContact = findOrCreateContact;
/**
 * Busca una conversación existente para un contacto.
 */
const findConversation = async (contactId) => {
    try {
        const res = await api.get('/conversations/search', {
            params: { locationId: LOCATION_ID, contactId }
        });
        const conversations = res.data?.conversations || [];
        return conversations.length > 0 ? conversations[0].id : null;
    }
    catch (error) {
        console.error('[Fontumi] Error buscando conversación:', error?.response?.data || error.message);
        return null;
    }
};
exports.findConversation = findConversation;
/**
 * Envía un mensaje de WhatsApp a través de Fontumi.
 */
const sendWhatsAppMessage = async (phone, text, contactId, conversationId) => {
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
            const contact = await (0, exports.findOrCreateContact)(phone);
            if (!contact) {
                console.error(`[Fontumi] No se pudo encontrar/crear contacto para ${phone}`);
                return false;
            }
            contactId = contact.id;
        }
        // Si no nos pasaron conversationId, buscamos una existente
        if (!conversationId) {
            conversationId = await (0, exports.findConversation)(contactId) || undefined;
        }
        // Enviar el mensaje
        const payload = {
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
    }
    catch (error) {
        console.error(`[Fontumi Error] Fallo enviando a ${phone}:`, error?.response?.data || error.message);
        // Fallback visual
        console.log(`\n======================================================`);
        console.log(`[WhatsApp - FALLBACK] Destino: ${phone}`);
        console.log(text);
        console.log(`======================================================\n`);
        return false;
    }
};
exports.sendWhatsAppMessage = sendWhatsAppMessage;
