import express from 'express';

const router = express.Router();

import {
    getTutors,
    getOneTutor,
    createTutor,
    updateTutor,
    deleteTutor,
} from "../controller/tutors.js"

// CREATE - POST
router.post('/', createTutor);

router.get('/', getTutors);

router.get('/:id', getOneTutor);

router.patch('/:id', updateTutor);

router.delete('/:id', deleteTutor);

export default router;