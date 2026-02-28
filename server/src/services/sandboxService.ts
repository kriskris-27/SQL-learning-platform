import { pgPool } from '../config/pg.js';
import Assignment from '../models/Assignment.js';
import { validateSQL } from '../utils/sqlValidator.js';

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

export interface QueryResult {
    rows: any[];
    rowCount: number | null;
    fields: any[];
}

export const executeQuery = async (sqlQuery: string): Promise<QueryResult> => {
    // Basic Sanitization: Remove semicolons (except at the very end) and multiple statements
    let sanitizedQuery = sqlQuery.trim();
    if (sanitizedQuery.includes(';')) {
        const statements = sanitizedQuery.split(';').filter(s => s.trim().length > 0);
        if (statements.length > 1) {
            throw new Error('Executing multiple statements is not allowed.');
        }
        sanitizedQuery = statements[0] || '';
    }

    // Validate SQL before execution
    const validation = validateSQL(sanitizedQuery);
    if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid SQL query');
    }

    const client = await pgPool.connect();
    try {
        const result = await client.query(sanitizedQuery);
        return {
            rows: result.rows,
            rowCount: result.rowCount,
            fields: result.fields.map(f => ({ name: f.name, dataTypeID: f.dataTypeID }))
        };
    } catch (error) {
        console.error('❌ Query Execution Error:', error);
        throw error;
    } finally {
        client.release();
    }
};
