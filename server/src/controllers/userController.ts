import { type Request, type Response } from 'express';
import UserProgress from '../models/UserProgress.js';

export const saveProgress = async (req: Request, res: Response) => {
    try {
        const { userId, assignmentId, lastQuery, isSolved } = req.body;

        if (!userId || !assignmentId) {
            return res.status(400).json({ message: 'userId and assignmentId are required.' });
        }

        const progress = await UserProgress.findOneAndUpdate(
            { userId, assignmentId },
            { lastQuery, isSolved },
            { upsert: true, new: true }
        );

        res.json({ message: 'Progress saved successfully.', progress });
    } catch (error: any) {
        res.status(500).json({ message: 'Error saving progress.', error: error.message });
    }
};

export const getProgress = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId as string;
        const assignmentId = req.params.assignmentId as string;

        const progress = await UserProgress.findOne({ userId, assignmentId });
        if (!progress) {
            return res.status(404).json({ message: 'No progress found for this assignment.' });
        }

        res.json(progress);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching progress.', error: error.message });
    }
};
