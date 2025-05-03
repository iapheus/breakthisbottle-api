import express from 'express';
import {
  sendMessage,
  receivedMessage,
} from '../controllers/messages.controller';

const router = express.Router();

router.post(['/send', '/send/:userId'], sendMessage);
router.get('/received', receivedMessage);

export default router;
