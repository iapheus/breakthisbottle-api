import express from 'express';
import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  loginUser,
} from '../controllers/users.controller';

const router = express.Router();

router.get('/:username', getUser);

router.post('/create', createUser);
router.post('/login', loginUser);

router.patch('/update', updateUser);
router.patch('/changePassword', changePassword);

router.delete('/delete', deleteUser);

export default router;
