import express from 'express';
import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
} from '../controllers/users.controller';

const router = express.Router();

router.get('/:id', getUser);
router.post('/create', createUser);
router.patch('/update', updateUser);
router.delete('/delete', deleteUser);
router.delete('/changePassword', changePassword);

export default router;
