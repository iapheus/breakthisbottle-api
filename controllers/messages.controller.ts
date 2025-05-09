import { Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import { errorCodes, messages } from '../utils/returnCodes';
import { User } from '../models/user.model';
import { Message } from '../models/messages.model';
import mongoose from 'mongoose';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

interface MessageSchema {
  toUserId: string;
  messageBody: string;
  isAnonymous: boolean;
}

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { messageBody, isAnonymous }: MessageSchema = req.body;
  const jwt: any = req.headers.authorization?.split(' ')[1] || undefined;

  let decodedToken: any;
  try {
    decodedToken = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    if (err instanceof jsonwebtoken.JsonWebTokenError) {
      res
        .status(401)
        .json({ success: false, message: messages.sessionExpired });
      return;
    }
  }

  if (!decodedToken.id || !decodedToken || jwt == undefined) {
    res.status(403).json({ success: false, message: messages.accessDenied });
    return;
  }

  if (!messageBody || !(isAnonymous == true || isAnonymous == false)) {
    res.status(400).json({ success: false, message: messages.requiredFields });
    return;
  }

  try {
    const itoken = new mongoose.Types.ObjectId(decodedToken.id);
    const randomUsers = await User.aggregate([
      { $match: { _id: { $ne: itoken } } },
      { $sample: { size: 1 } },
    ]);
    const toUserId = randomUsers.map((person) => person._id.toString());

    if (isAnonymous) {
      const _ = await new Message({
        toUserId: toUserId[0],
        isAnonymous: true,
        messageBody,
      });
      await _.save();
      res.status(200).json({ success: true });
      return;
    } else {
      const _ = await new Message({
        fromUserId: decodedToken.id,
        toUserId: toUserId[0],
        isAnonymous: false,
        messageBody,
      });
      await _.save();
      res.status(200).json({ success: true });
      return;
    }
  } catch (err) {
    res.status(500).json({ success: false, error: errorCodes[err.code] });
    return;
  }
};

export const sendMessageWithUserID = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    messageBody,
    isAnonymous = false,
    toUserId,
  }: MessageSchema = req.body;
  const jwt: any = req.headers.authorization?.split(' ')[1] || undefined;

  let decodedToken: any;
  try {
    decodedToken = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    if (err instanceof jsonwebtoken.JsonWebTokenError) {
      res
        .status(401)
        .json({ success: false, message: messages.sessionExpired });
      return;
    }
  }

  if (!decodedToken.id || !decodedToken || jwt == undefined) {
    res.status(403).json({ success: false, message: messages.accessDenied });
    return;
  }

  if (!messageBody || !isAnonymous || !toUserId) {
    res.status(400).json({ success: false, message: messages.requiredFields });
    return;
  }

  try {
    const _ = await new Message({
      fromUserId: decodedToken.id,
      toUserId,
      isAnonymous: false,
      messageBody,
    });
    await _.save();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: errorCodes[err.code] });
    return;
  }
};

export const receivedMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const jwt: any = req.headers.authorization?.split(' ')[1] || undefined;

  let decodedToken: any;
  try {
    decodedToken = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    if (err instanceof jsonwebtoken.JsonWebTokenError) {
      res
        .status(401)
        .json({ success: false, message: messages.sessionExpired });
      return;
    }
  }

  if (!decodedToken.id || !decodedToken || jwt == undefined) {
    res.status(403).json({ success: false, message: messages.accessDenied });
    return;
  }

  try {
    const itoken = new mongoose.Types.ObjectId(decodedToken.id);
    const _ = await Message.find({ toUserId: itoken });
    res.status(200).json({ success: true, data: _ });
  } catch (err) {
    res.status(500).json({ success: false, error: errorCodes[err.code] });
    return;
  }
};
