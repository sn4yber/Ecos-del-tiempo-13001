"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processIncomingMessage = void 0;
const tourist_service_1 = require("./tourist.service");
const whatsapp_service_1 = require("./whatsapp.service");
const gemini_service_1 = require("./gemini.service");
const tour_data_1 = require("../data/tour.data");
const database_1 = require("../config/database"); // Necesario para actualizar el tour_id
const languages_data_1 = require("../data/languages.data");
/**
 * Procesador central de mensajes.
 * Implementa una máquina de estados sencilla para el MVP.
 */
const processIncomingMessage = async (phone, text) => {
    console.log(`[Conversation] Procesando mensaje de ${phone}: ${text}`);
    // 1. Identificar o crear al turista en la base de datos
    const tourist = await (0, tourist_service_1.upsertTourist)(phone);
    // (Hackathon Mock) Si no tiene tour asignado, le ponemos uno por defecto para la demo
    if (!tourist.tour_id || !tour_data_1.EXPERIENCES[tourist.tour_id]) {
        const defaultTour = 'castillo_san_felipe';
        await (0, database_1.query)('UPDATE tourist SET tour_id = $1 WHERE phone = $2', [defaultTour, phone]);
        tourist.tour_id = defaultTour;
    }
    // 2. Enrutar según el estado actual del turista
    switch (tourist.status) {
        case 'NEW':
            await handleNewUser(tourist, text);
            break;
        case 'LANGUAGE_SELECTED':
            await handleLanguageSelected(tourist, text);
            break;
        case 'PRE_TOUR':
            await handlePreTour(tourist, text);
            break;
        case 'TOUR_COMPLETED':
            await handleTourCompleted(tourist, text);
            break;
        default:
            console.log(`[Conversation] Estado no manejado: ${tourist.status} para ${phone}`);
            await handlePreTour(tourist, text);
            break;
    }
};
exports.processIncomingMessage = processIncomingMessage;
const handleNewUser = async (tourist, text) => {
    console.log(`[Flow] Turista nuevo: ${tourist.phone}. Solicitando idioma.`);
    // Genera el menú dinámicamente desde nuestro objeto de idiomas
    const welcomeMsg = (0, languages_data_1.generateLanguageMenu)();
    await (0, whatsapp_service_1.sendWhatsAppMessage)(tourist.phone, welcomeMsg);
    await (0, tourist_service_1.updateTouristStatus)(tourist.phone, 'LANGUAGE_SELECTED');
};
const handleLanguageSelected = async (tourist, text) => {
    console.log(`[Flow] Turista ${tourist.phone} seleccionando idioma: ${text}`);
    // Resolvemos el idioma basado en el input (número, código o nombre)
    const langCode = (0, languages_data_1.resolveLanguage)(text);
    const langConfig = (0, languages_data_1.getLanguage)(langCode);
    const exp = tour_data_1.EXPERIENCES[tourist.tour_id || 'castillo_san_felipe'];
    // Mensaje de confirmación del idioma
    let reply = `${langConfig.welcomeMessage}\n\n`;
    // Info del tour en el idioma seleccionado usando el template
    reply += langConfig.tourInfoTemplate(exp.name, exp.meetingPoint, exp.googleMapsUrl);
    // Guardar idioma en DB
    await (0, tourist_service_1.upsertTourist)(tourist.phone, langCode);
    // Enviar el mensaje estructurado con el Google Maps Link
    await (0, whatsapp_service_1.sendWhatsAppMessage)(tourist.phone, reply);
    // Avanzar estado
    await (0, tourist_service_1.updateTouristStatus)(tourist.phone, 'PRE_TOUR');
};
const handlePreTour = async (tourist, text) => {
    console.log(`[Flow] Interacción PRE_TOUR con ${tourist.phone}. Mensaje: ${text}`);
    if (text.toLowerCase().trim() === 'terminar tour' || text.toLowerCase().trim() === 'end tour') {
        await handleTourCompleted(tourist, text);
        return;
    }
    const languageCode = tourist.language || 'es';
    const langName = (0, languages_data_1.getLanguage)(languageCode).name;
    // Generamos el contexto de Gemini dinámicamente según el tour del usuario
    const dynamicContext = (0, tour_data_1.generateTourContext)(tourist.tour_id);
    // Pasamos el nombre del idioma a Gemini para mayor claridad ("Español", "English", "Português", etc.)
    const aiResponse = await (0, gemini_service_1.getGeminiResponse)(dynamicContext, text, langName);
    await (0, whatsapp_service_1.sendWhatsAppMessage)(tourist.phone, aiResponse);
};
const handleTourCompleted = async (tourist, text) => {
    console.log(`[Flow] Finalizando tour para ${tourist.phone}`);
    const languageCode = tourist.language || 'es';
    const langConfig = (0, languages_data_1.getLanguage)(languageCode);
    // Usar el mensaje de reseña en el idioma correcto
    const reviewMsg = langConfig.reviewMessage;
    await (0, whatsapp_service_1.sendWhatsAppMessage)(tourist.phone, reviewMsg);
    await (0, tourist_service_1.updateTouristStatus)(tourist.phone, 'REVIEW_REQUESTED');
};
