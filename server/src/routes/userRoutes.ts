import express from 'express';
import { saveProgress, getProgress } from '../controllers/userController.js';

const router = express.Router();

router.post('/save', saveProgress);
router.get('/:userId/:assignmentId', getProgress);

export default router;
