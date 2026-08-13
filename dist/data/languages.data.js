"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguage = exports.resolveLanguage = exports.generateLanguageMenu = exports.SUPPORTED_LANGUAGES = void 0;
exports.SUPPORTED_LANGUAGES = {
    es: {
        code: 'es',
        flag: '🇪🇸',
        name: 'Español',
        welcomeMessage: '¡Perfecto! Tu idioma configurado es Español. 🇪🇸',
        tourInfoTemplate: (name, point, maps) => `Aquí tienes la información para tu experiencia VR:\n\n🕰️ Experiencia: ${name}\n📍 Punto de encuentro: ${point}\n🗺️ Cómo llegar: ${maps}\n\nTe recomendamos llegar 10 minutos antes para comenzar a tiempo.\n\nSi tienes dudas, ¡solo escríbelas aquí!`,
        reviewMessage: '¡Esperamos que hayas disfrutado el tour VR *Ecos del Tiempo*! 🕰️\n\n¿Nos regalarías un minuto para dejarnos una reseña? ¡Nos ayuda muchísimo! ⭐\nhttps://g.page/r/example/review'
    },
    en: {
        code: 'en',
        flag: '🇺🇸',
        name: 'English',
        welcomeMessage: 'Perfect! Your language is set to English. 🇺🇸',
        tourInfoTemplate: (name, point, maps) => `Here is the information for your VR experience:\n\n🕰️ Experience: ${name}\n📍 Meeting point: ${point}\n🗺️ How to get there: ${maps}\n\nWe recommend arriving 10 minutes early to start on time.\n\nIf you have any questions, just reply here!`,
        reviewMessage: 'We hope you enjoyed the *Ecos del Tiempo* VR Tour! 🕰️\n\nCould you take a minute to leave us a review? It helps us a lot! ⭐\nhttps://g.page/r/example/review'
    },
    pt: {
        code: 'pt',
        flag: '🇧🇷',
        name: 'Português',
        welcomeMessage: 'Perfeito! Seu idioma foi configurado para Português. 🇧🇷',
        tourInfoTemplate: (name, point, maps) => `Aqui estão as informações da sua experiência VR:\n\n🕰️ Experiência: ${name}\n📍 Ponto de encontro: ${point}\n🗺️ Como chegar: ${maps}\n\nRecomendamos chegar 10 minutos antes para começar no horário.\n\nSe tiver dúvidas, é só escrever aqui!`,
        reviewMessage: 'Esperamos que você tenha aproveitado o tour VR *Ecos del Tiempo*! 🕰️\n\nPoderia dedicar um minuto para nos deixar uma avaliação? Isso nos ajuda muito! ⭐\nhttps://g.page/r/example/review'
    },
    fr: {
        code: 'fr',
        flag: '🇫🇷',
        name: 'Français',
        welcomeMessage: 'Parfait ! Votre langue est configurée en Français. 🇫🇷',
        tourInfoTemplate: (name, point, maps) => `Voici les informations pour votre expérience VR :\n\n🕰️ Expérience : ${name}\n📍 Point de rencontre : ${point}\n🗺️ Comment y arriver : ${maps}\n\nNous vous recommandons d'arriver 10 minutes en avance.\n\nSi vous avez des questions, écrivez-nous ici !`,
        reviewMessage: 'Nous espérons que vous avez apprécié le tour VR *Ecos del Tiempo* ! 🕰️\n\nPourriez-vous prendre une minute pour nous laisser un avis ? Cela nous aide beaucoup ! ⭐\nhttps://g.page/r/example/review'
    },
    de: {
        code: 'de',
        flag: '🇩🇪',
        name: 'Deutsch',
        welcomeMessage: 'Perfekt! Ihre Sprache ist auf Deutsch eingestellt. 🇩🇪',
        tourInfoTemplate: (name, point, maps) => `Hier sind die Informationen zu Ihrem VR-Erlebnis:\n\n🕰️ Erlebnis: ${name}\n📍 Treffpunkt: ${point}\n🗺️ Anfahrt: ${maps}\n\nWir empfehlen, 10 Minuten früher zu kommen.\n\nBei Fragen schreiben Sie uns einfach hier!`,
        reviewMessage: 'Wir hoffen, dass Ihnen die VR-Tour *Ecos del Tiempo* gefallen hat! 🕰️\n\nKönnten Sie sich eine Minute Zeit nehmen, um uns eine Bewertung zu hinterlassen? Das hilft uns sehr! ⭐\nhttps://g.page/r/example/review'
    },
    it: {
        code: 'it',
        flag: '🇮🇹',
        name: 'Italiano',
        welcomeMessage: 'Perfetto! La tua lingua è impostata su Italiano. 🇮🇹',
        tourInfoTemplate: (name, point, maps) => `Ecco le informazioni per la tua esperienza VR:\n\n🕰️ Esperienza: ${name}\n📍 Punto d'incontro: ${point}\n🗺️ Come arrivare: ${maps}\n\nTi consigliamo di arrivare 10 minuti prima.\n\nSe hai domande, scrivici qui!`,
        reviewMessage: 'Speriamo che tu abbia apprezzato il tour VR *Ecos del Tiempo*! 🕰️\n\nPotresti dedicare un minuto per lasciarci una recensione? Ci aiuta tantissimo! ⭐\nhttps://g.page/r/example/review'
    },
    zh: {
        code: 'zh',
        flag: '🇨🇳',
        name: '中文',
        welcomeMessage: '完美！您的语言已设置为中文。🇨🇳',
        tourInfoTemplate: (name, point, maps) => `以下是您的VR体验信息：\n\n🕰️ 体验：${name}\n📍 集合地点：${point}\n🗺️ 如何到达：${maps}\n\n建议提前10分钟到达。\n\n如有任何问题，请在此留言！`,
        reviewMessage: '希望您享受了 *Ecos del Tiempo* VR之旅！🕰️\n\n能否花一分钟给我们留下评价？这对我们帮助很大！⭐\nhttps://g.page/r/example/review'
    },
    ja: {
        code: 'ja',
        flag: '🇯🇵',
        name: '日本語',
        welcomeMessage: '完了！言語は日本語に設定されました。🇯🇵',
        tourInfoTemplate: (name, point, maps) => `VR体験の情報はこちらです：\n\n🕰️ 体験：${name}\n📍 集合場所：${point}\n🗺️ アクセス：${maps}\n\n開始時間の10分前に到着することをお勧めします。\n\nご質問があればお気軽にどうぞ！`,
        reviewMessage: '*Ecos del Tiempo* VRツアーをお楽しみいただけたでしょうか！🕰️\n\nレビューを残していただけますか？大変助かります！⭐\nhttps://g.page/r/example/review'
    },
    he: {
        code: 'he',
        flag: '🇮🇱',
        name: 'עברית',
        welcomeMessage: '!מושלם! השפה שלך הוגדרה לעברית 🇮🇱',
        tourInfoTemplate: (name, point, maps) => `הנה המידע לחוויית ה-VR שלך:\n\n🕰️ חוויה: ${name}\n📍 נקודת מפגש: ${point}\n🗺️ איך להגיע: ${maps}\n\nמומלץ להגיע 10 דקות לפני הזמן.\n\nשאלות? פשוט כתבו כאן!`,
        reviewMessage: '!מקווים שנהנית מסיור ה-VR של *Ecos del Tiempo* 🕰️\n\n?אפשר דקה להשאיר לנו ביקורת? זה עוזר לנו המון ⭐\nhttps://g.page/r/example/review'
    }
};
// Genera el menú de selección de idioma dinámicamente desde el objeto
const generateLanguageMenu = () => {
    const header = '🌎 ¿En qué idioma prefieres vivir la experiencia?\nIn which language do you prefer to enjoy the experience?\n';
    const options = Object.values(exports.SUPPORTED_LANGUAGES)
        .map((lang, i) => `${i + 1}. ${lang.flag} ${lang.name}`)
        .join('\n');
    return `${header}\n${options}`;
};
exports.generateLanguageMenu = generateLanguageMenu;
// Mapea la respuesta del turista (número o texto) al código de idioma
const resolveLanguage = (input) => {
    const trimmed = input.toLowerCase().trim();
    const langs = Object.values(exports.SUPPORTED_LANGUAGES);
    // Buscar por número (1-9)
    const num = parseInt(trimmed);
    if (num >= 1 && num <= langs.length) {
        return langs[num - 1].code;
    }
    // Buscar por nombre o código
    for (const lang of langs) {
        if (trimmed === lang.code || trimmed === lang.name.toLowerCase()) {
            return lang.code;
        }
    }
    // Fallback: español
    return 'es';
};
exports.resolveLanguage = resolveLanguage;
const getLanguage = (code) => {
    return exports.SUPPORTED_LANGUAGES[code] || exports.SUPPORTED_LANGUAGES['es'];
};
exports.getLanguage = getLanguage;
