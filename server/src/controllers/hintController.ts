import { type Response } from 'express';
import Assignment from '../models/Assignment.js';
import { generateSQLHint } from '../services/aiService.js';
import { type AuthRequest } from '../middleware/authMiddleware.js';

export const getHint = async (req: AuthRequest, res: Response) => {
    try {
        const { assignmentId, userQuery } = req.body;
        const userId = req.user?.id;

        if (!assignmentId) {
            return res.status(400).json({ message: 'assignmentId is required.' });
        }

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found.' });
        }

        console.log(`🤖 Generating hint for user: ${userId}, assignment: ${assignmentId}`);

        const hint = await generateSQLHint(
            assignment.question,
            assignment.solutionQuery,
            userQuery || ''
        );

        res.json({ hint });
    } catch (error: any) {
        res.status(500).json({ message: 'Error generating hint.', error: error.message });
    }
};
