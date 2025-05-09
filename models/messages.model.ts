import mongoose from 'mongoose';
import { User } from './user.model';

export const messageSchema: mongoose.Schema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    unique: false,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: false,
  },
  isAnonymous: {
    type: Boolean,
    required: true,
  },
  messageBody: {
    type: String,
    required: true,
  },
});

export const Message = mongoose.model('Message', messageSchema);
