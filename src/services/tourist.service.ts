import { query } from '../config/database';

export interface Tourist {
    id: number;
    phone: string;
    language?: string;
    tour_id?: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}

export const getTouristByPhone = async (phone: string): Promise<Tourist | null> => {
    const res = await query('SELECT * FROM tourist WHERE phone = $1', [phone]);
    return res.rows.length > 0 ? res.rows[0] : null;
};

export const createTourist = async (phone: string, language?: string): Promise<Tourist> => {
    const res = await query(
        `INSERT INTO tourist (phone, language) 
         VALUES ($1, $2) 
         RETURNING *`,
        [phone, language]
    );
    return res.rows[0];
};

export const updateTouristStatus = async (phone: string, status: string): Promise<Tourist> => {
    const res = await query(
        `UPDATE tourist 
         SET status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE phone = $2 
         RETURNING *`,
        [status, phone]
    );
    return res.rows[0];
};

export const upsertTourist = async (phone: string, language?: string): Promise<Tourist> => {
    const existing = await getTouristByPhone(phone);
    if (existing) {
        if (language && existing.language !== language) {
             const res = await query(
                `UPDATE tourist 
                 SET language = $1, updated_at = CURRENT_TIMESTAMP 
                 WHERE phone = $2 
                 RETURNING *`,
                [language, phone]
            );
            return res.rows[0];
        }
        return existing;
    } else {
        return createTourist(phone, language);
    }
};
