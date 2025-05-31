import express from 'express';
import { userRegister, userLogin, verificationEmail, uploadData } from '../controller/users.js';
import upload from '../middleware/multer.js';
import path from "path";

const router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.get('/verify/:token', verificationEmail);
router.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const { filename, path: filePath, size } = req.file;

    const saved = await prisma.upload.create({
      data: {
        filename,
        path: filePath, 
        size: Number(size),
      },
    });

    res.json({ status: 'success', data: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Upload failed' });
  } 
});

export default router;
