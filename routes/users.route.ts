import express from 'express';
import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
} from '../controllers/users.controller';

const router = express.Router();

router.get('/:username', getUser);
router.post('/create', createUser);
router.patch('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);
router.patch('/changePassword/:id', changePassword);

export default router;
