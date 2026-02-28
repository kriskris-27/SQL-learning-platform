import express from 'express';
import { runQuery } from '../controllers/queryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, runQuery);

export default router;
