import { pgPool } from '../config/pg.js';
import Assignment from '../models/Assignment.js';

export const setupAssignmentSandbox = async (assignmentId: string): Promise<void> => {
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
        throw new Error('Assignment not found');
    }

    const client = await pgPool.connect();

    try {
        await client.query('BEGIN');

        // Clear existing data (optional but recommended for a clean sandbox state)
        // In a real multi-tenant system, we would use separate schemas or databases.
        // For this assignment, we'll just run the provided setup queries.

        for (const table of assignment.tableMetadata) {
            // Drop table if exists to ensure a fresh state
            await client.query(`DROP TABLE IF EXISTS ${table.tableName} CASCADE`);

            // Run Create Table Query
            await client.query(table.createTableQuery);

            // Run Insert Data Query
            await client.query(table.insertDataQuery);
        }

        await client.query('COMMIT');
        console.log(`✅ Sandbox setup complete for assignment: ${assignment.title}`);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Sandbox Setup Error:', error);
        throw error;
    } finally {
        client.release();
    }
};
