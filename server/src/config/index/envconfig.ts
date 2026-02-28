import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
    'MONGODB_URI',
    'PG_HOST',
    'PG_USER',
    'PG_PASSWORD',
    'PG_DATABASE',
    'LLM_API_KEY'
];

export const validateEnv = () => {
    const missing = requiredEnvVars.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        console.error(`❌ Missing environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }
};

export const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: (process.env.JWT_SECRET as string) || 'supersecretkey',
    mongodb: {
        uri: process.env.MONGODB_URI as string,
    },
    pg: {
        host: process.env.PG_HOST as string,
        port: parseInt(process.env.PG_PORT || '5432', 10),
        user: process.env.PG_USER as string,
        password: process.env.PG_PASSWORD as string,
        database: process.env.PG_DATABASE as string,
    },
    llm: {
        apiKey: process.env.LLM_API_KEY as string,
        model: process.env.LLM_MODEL || 'gemini-1.5-flash',
    }
};
