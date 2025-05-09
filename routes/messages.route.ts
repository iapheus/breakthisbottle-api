import express from 'express';
import {
  sendMessage,
  sendMessageWithUserID,
  receivedMessage,
} from '../controllers/messages.controller';

const router = express.Router();

router.get('/received', receivedMessage);

router.post('/send', sendMessage);
router.post('/send/:userId', sendMessageWithUserID);

export default router;
