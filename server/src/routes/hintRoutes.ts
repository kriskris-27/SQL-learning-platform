import express from 'express';
import { getHint } from '../controllers/hintController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, getHint);

export default router;
