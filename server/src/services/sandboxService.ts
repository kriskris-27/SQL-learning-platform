import { pgPool } from '../config/pg.js';
import Assignment from '../models/Assignment.js';
import { validateSQL } from '../utils/sqlValidator.js';

/**
 * PRODUCTION-LEVEL SANDBOX ISOLATION
 * Instead of creating tables in the 'public' schema, we create a unique schema for each user.
 * This prevents data clobbering when multiple users are practicing.
 */

const getSafeSchemaName = (userId: string) => {
    // Sanitize userId to be a valid Postgres schema name (alphanumeric and underscore only)
    return `user_${userId.replace(/[^a-zA-Z0-9]/g, '_')}`;
};

export const setupAssignmentSandbox = async (assignmentId: string, userId: string): Promise<string> => {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new Error('Assignment not found');

    const schemaName = getSafeSchemaName(userId);
    const client = await pgPool.connect();

    try {
        await client.query('BEGIN');

        // 1. Create unique schema for the user
        await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

        // 2. Set search path to this schema so user doesn't affect others
        await client.query(`SET search_path TO ${schemaName}`);

        for (const table of assignment.tableMetadata) {
            // Drop and recreate tables INSIDE this user's schema
            await client.query(`DROP TABLE IF EXISTS ${table.tableName} CASCADE`);
            await client.query(table.createTableQuery);
            await client.query(table.insertDataQuery);
        }

        await client.query('COMMIT');
        console.log(`✅ Isolated sandbox ready: ${schemaName} for assignment: ${assignment.title}`);
        return schemaName;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Sandbox Isolation Error:', error);
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

export const executeQuery = async (sqlQuery: string, userId: string): Promise<QueryResult> => {
    let sanitizedQuery = sqlQuery.trim();
    if (sanitizedQuery.includes(';')) {
        const statements = sanitizedQuery.split(';').filter(s => s.trim().length > 0);
        if (statements.length > 1) throw new Error('Multiple statements not allowed.');
        sanitizedQuery = statements[0] || '';
    }

    const validation = validateSQL(sanitizedQuery);
    if (!validation.isValid) throw new Error(validation.error);

    const schemaName = getSafeSchemaName(userId);
    const client = await pgPool.connect();

    try {
        // Force the user to stay in their own schema
        await client.query(`SET search_path TO ${schemaName}`);

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
