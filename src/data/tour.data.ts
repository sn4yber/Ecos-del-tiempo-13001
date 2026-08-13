export interface TourExperience {
    id: string;
    name: string;
    meetingPoint: string;
    googleMapsUrl: string;
}

export const EXPERIENCES: Record<string, TourExperience> = {
    'torre_reloj': {
        id: 'torre_reloj',
        name: 'Ecos del Tiempo — Torre del Reloj',
        meetingPoint: 'Plaza de los Coches',
        googleMapsUrl: 'https://maps.app.goo.gl/PlazaDeLosCoches'
    },
    'castillo_san_felipe': {
        id: 'castillo_san_felipe',
        name: 'Ecos del Tiempo — Castillo de San Felipe',
        meetingPoint: 'Entrada principal del Castillo de San Felipe',
        googleMapsUrl: 'https://maps.app.goo.gl/CastilloSanFelipe'
    },
    'invasion': {
        id: 'invasion',
        name: 'Ecos del Tiempo — La invasión que nunca fue',
        meetingPoint: 'Baluarte de Santo Domingo',
        googleMapsUrl: 'https://maps.app.goo.gl/BaluarteSantoDomingo'
    },
    'independencia': {
        id: 'independencia',
        name: 'Ecos del Tiempo — Camino a la Independencia',
        meetingPoint: 'Plaza de la Aduana',
        googleMapsUrl: 'https://maps.app.goo.gl/PlazaDeLaAduana'
    }
};

export const generateTourContext = (experienceId?: string) => {
    let experienceText = '';
    
    if (experienceId && EXPERIENCES[experienceId]) {
        const exp = EXPERIENCES[experienceId];
        experienceText = `
EXPERIENCIA ACTUAL DEL TURISTA:
- Nombre: ${exp.name}
- Punto de encuentro para Ecos del Tiempo: ${exp.meetingPoint}
- Link de Google Maps: ${exp.googleMapsUrl}`;
    } else {
        experienceText = `El turista aún no tiene una experiencia asignada específica. Sus opciones de VR son: Torre del Reloj, Castillo de San Felipe, La invasión, Camino a la Independencia.`;
    }

    return `
CONTEXTO FUNDAMENTAL DEL NEGOCIO:
"Ecos del Tiempo" proporciona experiencias inmersivas de Realidad Virtual (VR) que se integran como un VALOR AGREGADO a tours físicos ya existentes.
${experienceText}

INFORMACIÓN OPERATIVA:
- Nosotros (Ecos del Tiempo) debemos encontrarnos con el turista en su punto designado para entregarle el equipo VR.
- Enlace oficial de reseñas (Google) para enviar al finalizar: https://g.page/r/example/review

REGLAS ESTRICTAS PARA EL ASISTENTE:
- NO inventes datos. Usa SOLO la información provista aquí.
- Sé servicial y orienta al turista hacia su punto de encuentro.
`;
};
