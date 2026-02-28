import { type Request, type Response } from 'express';
import { setupAssignmentSandbox, executeQuery } from '../services/sandboxService.js';

export const runQuery = async (req: Request, res: Response) => {
    try {
        const { assignmentId, sqlQuery, userId } = req.body;

        if (!assignmentId || !sqlQuery || !userId) {
            return res.status(400).json({ message: 'assignmentId, sqlQuery, and userId are required.' });
        }

        // 1. Prepare isolated sandbox
        try {
            await setupAssignmentSandbox(assignmentId, userId);
        } catch (setupError: any) {
            return res.status(500).json({
                message: 'Failed to prepare sandbox database.',
                error: setupError.message
            });
        }

        // 2. Execute user query in isolation
        try {
            const result = await executeQuery(sqlQuery, userId);
            res.json(result);
        } catch (queryError: any) {
            // Return 400 for SQL errors (expected during learning)
            // Return 500 for internal errors
            const isValidationError = queryError.message.includes('not allowed') || queryError.message.includes('multiple statements');
            res.status(isValidationError ? 400 : 200).json({
                message: 'Query execution failed.',
                error: queryError.message,
                isSqlError: !isValidationError
            });
        }
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
