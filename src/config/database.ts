import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

// Test the connection immediately
pool.connect()
    .then(client => {
        console.log('--- Successfully connected to Neon PostgreSQL ---');
        client.release();
    })
    .catch(err => {
        console.error('--- Error connecting to database ---', err.stack);
    });
