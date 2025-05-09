import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import { errorCodes, messages } from '../utils/returnCodes';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

interface UserCredentials {
  username: string;
  email: string;
  password: string;
  gender?: string;
  location?: string;
  biography?: string;
  profilePicture?: string;
  dateOfBirth?: Date;
}

// POST -> /api/users/login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: UserCredentials = req.body;

  const user = await User.findOne({ email });

  if (user) {
    if (await bcrypt.compare(password, user.password!)) {
      const token = jsonwebtoken.sign(
        {
          id: user._id,
          username: user.username,
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.status(200).json({ success: true, token: token });
    } else {
      res.status(400).json({ success: false, message: messages.wrongPassword });
    }
  } else {
    res.status(404).json({ success: false, message: messages.userNotFound });
  }
};

// GET -> /api/users/:username
export const getUser = async (req: Request, res: Response): Promise<void> => {
  const username: string = req.params.username;
  try {
    const user = await User.findOne({ username });
    if (user) {
      res.status(200).json({
        success: true,
        data: {
          username: user.username,
          gender: user.gender,
          location: user.location,
          biography: user.biography,
          profilePicture: user.profilePicture,
          dateOfBirth: user.dateOfBirth,
        },
      });
    } else {
      res.status(404).json({ success: false, error: messages.userNotFound });
    }
  } catch (err) {
    res.status(400).json({ success: false, error: errorCodes[err] });
  }
};

// POST -> /api/users/create
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user: UserCredentials = req.body;

  try {
    if (!user.username || !user.email || !user.password) {
      res.status(400).json({ success: false, error: messages.requiredFields });
    } else {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const _ = await new User({ ...user, password: hashedPassword });
      await _.save();
      res
        .status(200)
        .json({ success: true, message: messages.registrationSuccessful });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: errorCodes[err.code] });
  }
};

// PATCH -> /api/users/update
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user: UserCredentials = req.body;
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
    const existingUser = await User.findById(decodedToken.id)!;
    if (!existingUser) {
      res.status(404).json({
        success: false,
        error: messages.userNotFound,
      });
      return;
    } else {
      const updatedUser = await User.findByIdAndUpdate(decodedToken.id, user, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        success: true,
        data: updatedUser,
      });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: errorCodes[err.code],
    });
    return;
  }
};

// DELETE -> /api/users/delete
export const deleteUser = async (
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
    const _ = await User.findByIdAndDelete(decodedToken.id);

    if (_ !== null)
      res.status(200).json({ success: true, message: messages.accountDeleted });
    else res.status(404).json({ success: false, error: messages.userNotFound });
  } catch (err) {
    res.status(500).json({ success: false, error: errorCodes[err.code] });
  }
};

// PATCH -> /api/users/changePassword
export const changePassword = async (
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

  const {
    newPassword,
    newPasswordRepeat,
  }: { newPassword: string; newPasswordRepeat: string } = req.body;

  if (newPassword != newPasswordRepeat) {
    res
      .status(400)
      .json({ success: false, message: messages.passwordMismatch });
  }

  try {
    const _ = await User.findById(decodedToken.id);
    if (!_) {
      res.status(404).json({ success: false, message: messages.userNotFound });
    } else {
      const password = await bcrypt.hash(newPassword, 10);
      await User.findByIdAndUpdate(
        decodedToken.id,
        { password },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json({ success: true });
    }
  } catch (error) {}
};
