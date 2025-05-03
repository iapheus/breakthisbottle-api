import { Request, Response } from 'express';

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(200).json({ status: true });
};

export const receivedMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(200).json({ status: true });
};
