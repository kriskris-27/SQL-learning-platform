import { type Response } from 'express';
import UserProgress from '../models/UserProgress.js';
import { type AuthRequest } from '../middleware/authMiddleware.js';

export const saveProgress = async (req: AuthRequest, res: Response) => {
    try {
        const { assignmentId, sqlQuery, isCompleted } = req.body;
        const userId = req.user?.id;

        if (!userId || !assignmentId) {
            return res.status(400).json({ message: 'userId and assignmentId are required.' });
        }

        const update: any = { sqlQuery, isCompleted, lastAttempt: new Date() };
        if (sqlQuery) {
            update.$inc = { attemptCount: 1 };
        }

        const progress = await UserProgress.findOneAndUpdate(
            { userId, assignmentId },
            update,
            { upsert: true, new: true }
        );

        res.json({ message: 'Progress saved successfully.', progress });
    } catch (error: any) {
        res.status(500).json({ message: 'Error saving progress.', error: error.message });
    }
};

export const getProgress = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const assignmentId = req.params.assignmentId;

        if (!userId || !assignmentId) {
            return res.status(400).json({ message: 'userId and assignmentId are required.' });
        }

        const progress = await UserProgress.findOne({ userId, assignmentId });
        if (!progress) {
            return res.status(404).json({ message: 'No progress found for this assignment.' });
        }

        res.json(progress);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching progress.', error: error.message });
    }
};
