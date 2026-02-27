import pg from 'pg';
import { config } from './index/envconfig.js';

const { Pool } = pg;

export const pgPool = new Pool({
    host: config.pg.host,
    port: config.pg.port,
    user: config.pg.user,
    password: config.pg.password,
    database: config.pg.database,
});

export const connectPostgres = async () => {
    try {
        const client = await pgPool.connect();
        console.log('✅ PostgreSQL Connected (Sandbox)');
        client.release();
    } catch (error) {
        console.error('❌ PostgreSQL Connection Error:', error);
        // We don't necessarily want to exit the process if the sandbox is down,
        // but for now, let's keep it consistent with MongoDB.
        process.exit(1);
    }
};
