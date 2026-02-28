import { type Request, type Response } from 'express';
import Assignment from '../models/Assignment.js';
import { generateSQLHint } from '../services/aiService.js';

export const getHint = async (req: Request, res: Response) => {
    try {
        const { assignmentId, userQuery } = req.body;

        if (!assignmentId) {
            return res.status(400).json({ message: 'assignmentId is required.' });
        }

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found.' });
        }

        // Prepare table schemas for the prompt
        const schemaString = assignment.tableMetadata
            .map(t => `Table: ${t.tableName}\nSchema: ${t.createTableQuery}`)
            .join('\n\n');

        const hint = await generateSQLHint(
            assignment.question,
            schemaString,
            userQuery
        );

        res.json({ hint });
    } catch (error: any) {
        console.error('❌ Hint API Error:', error);
        res.status(500).json({ message: 'Error generating hint.', error: error.message });
    }
};
