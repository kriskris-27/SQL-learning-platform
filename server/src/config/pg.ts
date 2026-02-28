import pg from 'pg';
import { config } from './index/envconfig.js';

const { Pool } = pg;

export const pgPool = new Pool({
    host: config.pg.host,
    port: config.pg.port,
    user: config.pg.user,
    password: config.pg.password,
    database: config.pg.database,
    ssl: {
        rejectUnauthorized: false
    }
});

export const connectPostgres = async () => {
    try {
        const client = await pgPool.connect();
        console.log('✅ PostgreSQL Connected (Sandbox)');
        client.release();
    } catch (error) {
        console.error('❌ PostgreSQL Connection Error:', error);
        // process.exit(1);
    }
};
