import { type Response } from 'express';
import { setupAssignmentSandbox, executeQuery } from '../services/sandboxService.js';
import { type AuthRequest } from '../middleware/authMiddleware.js';

export const runQuery = async (req: AuthRequest, res: Response) => {
    try {
        const { assignmentId, sqlQuery } = req.body;
        const userId = req.user?.id;

        if (!assignmentId || !sqlQuery || !userId) {
            return res.status(400).json({ message: 'assignmentId, sqlQuery, and userId are required.' });
        }

        console.log(`🚀 Running query for user: ${userId}, assignment: ${assignmentId}`);

        await setupAssignmentSandbox(assignmentId, userId);
        const result = await executeQuery(sqlQuery, userId);

        res.json({
            success: true,
            data: result.rows,
            rowCount: result.rowCount
        });
    } catch (error: any) {
        console.error('❌ Query Execution Error:', error);
        res.status(500).json({ message: 'Error executing query', error: error.message });
    }
};
