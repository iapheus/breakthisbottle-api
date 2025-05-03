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

// GET -> /api/users/:id
export const getUser = async (req: Request, res: Response): Promise<void> => {
  const id: string = req.params.id;
  try {
    const user = await User.findById(id);
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
    }
    res.status(404).json({ success: false, error: messages.userNotFound });
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
  const user: UserCredentials = req.body.user;
  const id: string = req.body.id;

  try {
    const existingUser = await User.findById(id)!;

    if (!existingUser) {
      res.status(404).json({
        success: false,
        error: messages.userNotFound,
      });
    }

    if (existingUser?.password != user.password) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          ...user,
          password: hashedPassword,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      await updatedUser?.save();

      res.status(200).json({
        status: true,
        data: updatedUser,
      });

      return;
    }

    const updatedUser = await User.findByIdAndUpdate(id, user, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      res.status(404).json({
        status: false,
        error: messages.userNotFound,
      });
      return;
    }

    await updatedUser?.save();

    res.status(200).json({
      status: true,
      data: updatedUser,
    });

    return;
  } catch (err) {
    res.status(500).json({
      status: false,
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
  const user: UserCredentials = req.body;
  // const jwtId: string | undefined = req.headers.authorization;

  const _ = await User.findOneAndDelete(user);
  res.status(200).json({ success: true, message: messages.accountDeleted });
};

// PATCH -> /api/users/changePassword
export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.status(200).json({ success: true });
};
