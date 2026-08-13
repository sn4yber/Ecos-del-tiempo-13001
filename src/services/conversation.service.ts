import { upsertTourist, updateTouristStatus, Tourist } from './tourist.service';
import { sendWhatsAppMessage } from './whatsapp.service';
import { getGeminiResponse } from './gemini.service';
import { EXPERIENCES, generateTourContext } from '../data/tour.data';
import { query } from '../config/database'; // Necesario para actualizar el tour_id
import { generateLanguageMenu, resolveLanguage, getLanguage } from '../data/languages.data';

/**
 * Procesador central de mensajes.
 * Implementa una máquina de estados sencilla para el MVP.
 */
export const processIncomingMessage = async (phone: string, text: string) => {
    console.log(`[Conversation] Procesando mensaje de ${phone}: ${text}`);

    // 1. Identificar o crear al turista en la base de datos
    const tourist = await upsertTourist(phone);

    // (Hackathon Mock) Si no tiene tour asignado, le ponemos uno por defecto para la demo
    if (!tourist.tour_id || !EXPERIENCES[tourist.tour_id]) {
        const defaultTour = 'castillo_san_felipe';
        await query('UPDATE tourist SET tour_id = $1 WHERE phone = $2', [defaultTour, phone]);
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

const handleNewUser = async (tourist: Tourist, text: string) => {
    console.log(`[Flow] Turista nuevo: ${tourist.phone}. Solicitando idioma.`);
    
    // Genera el menú dinámicamente desde nuestro objeto de idiomas
    const welcomeMsg = generateLanguageMenu();
    
    await sendWhatsAppMessage(tourist.phone, welcomeMsg);
    await updateTouristStatus(tourist.phone, 'LANGUAGE_SELECTED');
};

const handleLanguageSelected = async (tourist: Tourist, text: string) => {
    console.log(`[Flow] Turista ${tourist.phone} seleccionando idioma: ${text}`);
    
    // Resolvemos el idioma basado en el input (número, código o nombre)
    const langCode = resolveLanguage(text);
    const langConfig = getLanguage(langCode);
    
    const exp = EXPERIENCES[tourist.tour_id || 'castillo_san_felipe'];
    
    // Mensaje de confirmación del idioma
    let reply = `${langConfig.welcomeMessage}\n\n`;
    
    // Info del tour en el idioma seleccionado usando el template
    reply += langConfig.tourInfoTemplate(exp.name, exp.meetingPoint, exp.googleMapsUrl);
    
    // Guardar idioma en DB
    await upsertTourist(tourist.phone, langCode);
    
    // Enviar el mensaje estructurado con el Google Maps Link
    await sendWhatsAppMessage(tourist.phone, reply);
    
    // Avanzar estado
    await updateTouristStatus(tourist.phone, 'PRE_TOUR');
};

const handlePreTour = async (tourist: Tourist, text: string) => {
    console.log(`[Flow] Interacción PRE_TOUR con ${tourist.phone}. Mensaje: ${text}`);
    
    if (text.toLowerCase().trim() === 'terminar tour' || text.toLowerCase().trim() === 'end tour') {
        await handleTourCompleted(tourist, text);
        return;
    }

    const languageCode = tourist.language || 'es';
    const langName = getLanguage(languageCode).name;

    // Generamos el contexto de Gemini dinámicamente según el tour del usuario
    const dynamicContext = generateTourContext(tourist.tour_id);
    
    // Pasamos el nombre del idioma a Gemini para mayor claridad ("Español", "English", "Português", etc.)
    const aiResponse = await getGeminiResponse(dynamicContext, text, langName);
    
    await sendWhatsAppMessage(tourist.phone, aiResponse);
};

const handleTourCompleted = async (tourist: Tourist, text: string) => {
    console.log(`[Flow] Finalizando tour para ${tourist.phone}`);
    const languageCode = tourist.language || 'es';
    const langConfig = getLanguage(languageCode);
    
    // Usar el mensaje de reseña en el idioma correcto
    const reviewMsg = langConfig.reviewMessage;

    await sendWhatsAppMessage(tourist.phone, reviewMsg);
    await updateTouristStatus(tourist.phone, 'REVIEW_REQUESTED');
};
