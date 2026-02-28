import express from 'express';
import { saveProgress, getProgress } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/save', protect, saveProgress);
router.get('/:assignmentId', protect, getProgress);

export default router;
