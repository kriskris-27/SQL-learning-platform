import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { config, validateEnv } from './config/index/envconfig.js';
import { connectMongoDB } from './config/db.js';
import { connectPostgres } from './config/pg.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import queryRoutes from './routes/queryRoutes.js';

validateEnv();
connectMongoDB();
connectPostgres();

const app = express();
const PORT = config.port;

app.use(cors());
app.use(express.json());

app.use('/api/assignments', assignmentRoutes);
app.use('/api/execute', queryRoutes);

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'CipherSQLStudio Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
