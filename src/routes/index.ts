import { Router } from 'express';
import { handleMessage } from '../controllers/message.controller';

const router = Router(); // Não use express.Router(), apenas Router()

// Rota de simulação da mensagem recebida no WhatsApp
router.post('/message', handleMessage);

export default router;
