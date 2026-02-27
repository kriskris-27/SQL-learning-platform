import mongoose from 'mongoose';
import { config } from './index/envconfig.js';

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(config.mongodb.uri);
        console.log('✅ MongoDB Connected (Persistence)');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};
