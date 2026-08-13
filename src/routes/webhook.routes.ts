import { Router } from 'express';
import { handleWhatsAppWebhook } from '../controllers/webhook.controller';

const router = Router();

router.post('/whatsapp', handleWhatsAppWebhook);

export default router;
