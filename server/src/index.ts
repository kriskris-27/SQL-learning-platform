import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config, validateEnv } from './config/index/envconfig.js';
import { connectMongoDB } from './config/db.js';
import { connectPostgres } from './config/pg.js';
import { seedDatabase } from './utils/seed.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import queryRoutes from './routes/queryRoutes.js';
import hintRoutes from './routes/hintRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

validateEnv();

const startServer = async () => {
    await connectMongoDB();
    await connectPostgres();

    // Auto-seed on startup (Development/Staging only recommended, but here per request)
    try {
        await seedDatabase();
    } catch (err) {
        console.error('⚠️ Seeding failed on startup, but server will continue.');
    }

    const app = express();
    const PORT = config.port;

    // Security Middleware
    app.use(helmet());
    app.use(cors());
    app.use(express.json());

    // Rate Limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 50,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    });
    app.use('/api/', limiter);

    app.use('/api/assignments', assignmentRoutes);
    app.use('/api/execute', queryRoutes);
    app.use('/api/hint', hintRoutes);
    app.use('/api/user', userRoutes);

    app.get('/health', (req: Request, res: Response) => {
        res.json({ status: 'OK', message: 'CipherSQLStudio Server is running' });
    });

    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer().catch(err => {
    console.error('🔥 Server failed to start:', err);
});
