import express from 'express';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhook.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Routes
app.use('/webhook', webhookRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'ecos-del-tiempo-api' });
});

app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
