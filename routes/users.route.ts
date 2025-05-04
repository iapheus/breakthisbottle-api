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

router.patch('/update/:id', updateUser);
router.patch('/changePassword/:id', changePassword);

router.delete('/delete/:id', deleteUser);

export default router;
