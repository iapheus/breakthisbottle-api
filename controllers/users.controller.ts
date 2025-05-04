import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import { errorCodes, messages } from '../utils/returnCodes';

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

// GET -> /api/users/:username +++
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

// POST -> /api/users/create +++
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

// PATCH -> /api/users/update/:id +++ TODO: JWT
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user: UserCredentials = req.body;
  const id: string = req.params.id;

  try {
    const existingUser = await User.findById(id)!;
    if (!existingUser) {
      res.status(404).json({
        success: false,
        error: messages.userNotFound,
      });
    } else {
      const updatedUser = await User.findByIdAndUpdate(id, user, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        status: true,
        data: updatedUser,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      error: errorCodes[err.code],
    });
  }
};

// DELETE -> /api/users/delete/:id +++ TODO: JWT
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id: string = req.params.id;
  // const jwtId: string | undefined = req.headers.authorization;

  try {
    const _ = await User.findByIdAndDelete(id);

    if (_ !== null)
      res.status(200).json({ success: true, message: messages.accountDeleted });
    else res.status(404).json({ success: false, error: messages.userNotFound });
  } catch (err) {
    res.status(500).json({ status: false, error: errorCodes[err.code] });
  }
};

// PATCH -> /api/users/changePassword/:id +++ TODO: JWT
export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id: string = req.params.id;
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
    const _ = await User.findById(id);
    if (!_) {
      res.status(404).json({ success: false, message: messages.userNotFound });
    } else {
      const password = await bcrypt.hash(newPassword, 10);
      await User.findByIdAndUpdate(
        id,
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
