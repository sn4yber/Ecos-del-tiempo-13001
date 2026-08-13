"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertTourist = exports.updateTouristStatus = exports.createTourist = exports.getTouristByPhone = void 0;
const database_1 = require("../config/database");
const getTouristByPhone = async (phone) => {
    const res = await (0, database_1.query)('SELECT * FROM tourist WHERE phone = $1', [phone]);
    return res.rows.length > 0 ? res.rows[0] : null;
};
exports.getTouristByPhone = getTouristByPhone;
const createTourist = async (phone, language) => {
    const res = await (0, database_1.query)(`INSERT INTO tourist (phone, language) 
         VALUES ($1, $2) 
         RETURNING *`, [phone, language]);
    return res.rows[0];
};
exports.createTourist = createTourist;
const updateTouristStatus = async (phone, status) => {
    const res = await (0, database_1.query)(`UPDATE tourist 
         SET status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE phone = $2 
         RETURNING *`, [status, phone]);
    return res.rows[0];
};
exports.updateTouristStatus = updateTouristStatus;
const upsertTourist = async (phone, language) => {
    const existing = await (0, exports.getTouristByPhone)(phone);
    if (existing) {
        if (language && existing.language !== language) {
            const res = await (0, database_1.query)(`UPDATE tourist 
                 SET language = $1, updated_at = CURRENT_TIMESTAMP 
                 WHERE phone = $2 
                 RETURNING *`, [language, phone]);
            return res.rows[0];
        }
        return existing;
    }
    else {
        return (0, exports.createTourist)(phone, language);
    }
};
exports.upsertTourist = upsertTourist;
