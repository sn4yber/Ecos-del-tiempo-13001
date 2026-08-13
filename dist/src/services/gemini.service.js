"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeminiResponse = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY);
// Usamos el modelo rápido y estándar de Gemini
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
const getGeminiResponse = async (context, userMessage, language = 'es') => {
    try {
        console.log(`[Gemini] Consultando IA para mensaje: "${userMessage}"`);
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'tu_api_key_aqui') {
            console.log('[Gemini - MOCK] No hay API key. Retornando respuesta estática.');
            return 'Simulación de respuesta inteligente de Gemini.';
        }
        const systemPrompt = `
Eres el asistente turístico oficial de "Ecos del Tiempo", una experiencia de turismo e historia en realidad virtual (VR) en Cartagena, Colombia.
El usuario seleccionó el idioma: ${language}. DEBES responder SIEMPRE en este idioma.

Reglas ESTRICTAS:
- Usa ÚNICAMENTE la siguiente información oficial del tour proporcionada en este prompt.
- NO inventes horarios, coordenadas, precios o disponibilidad.
- Sé amable, conciso y directo, recuerda que es una conversación de WhatsApp.
- Si el turista pregunta algo fuera del contexto provisto, indica amablemente que no tienes la respuesta y pide que esperen a un guía humano.

INFORMACIÓN OFICIAL DEL TOUR:
${context}
`;
        const prompt = `${systemPrompt}\n\nMensaje del turista: ${userMessage}\n\nTu respuesta:`;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        return responseText;
    }
    catch (error) {
        console.error('[Gemini Error] Falló la generación de respuesta:', error);
        return 'Lo siento, en este momento tengo problemas de conexión. Por favor intenta de nuevo en unos minutos.';
    }
};
exports.getGeminiResponse = getGeminiResponse;
