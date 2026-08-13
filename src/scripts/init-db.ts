import { query } from '../config/database';

const initDB = async () => {
    try {
        console.log('--- Initializing database tables ---');

        await query(`
            CREATE TABLE IF NOT EXISTS tourist (
                id SERIAL PRIMARY KEY,
                phone VARCHAR(50) UNIQUE NOT NULL,
                language VARCHAR(10),
                tour_id VARCHAR(50),
                status VARCHAR(50) DEFAULT 'NEW',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await query(`
            CREATE TABLE IF NOT EXISTS conversation (
                id SERIAL PRIMARY KEY,
                tourist_id INTEGER REFERENCES tourist(id) ON DELETE CASCADE,
                role VARCHAR(20) NOT NULL,
                message TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('--- Tables created successfully ---');
        process.exit(0);
    } catch (error) {
        console.error('--- Error initializing database ---', error);
        process.exit(1);
    }
};

initDB();
