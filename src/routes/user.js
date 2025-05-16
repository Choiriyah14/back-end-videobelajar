import express from 'express';
import { userRegister, userLogin, verificationEmail } from '../controller/users.js';

const router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.get('/verify/:token', verificationEmail);

export default router;
