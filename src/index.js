import express from 'express';
import dotenv from 'dotenv';
import tutorRoutes from './routes/tutor.js';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/tutor', tutorRoutes);
app.use('/api/user', userRoutes);

app.listen(4000, () => {
    console.log('Server berhasil di running di port 4000');
})