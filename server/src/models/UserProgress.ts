import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProgress extends Document {
    userId: string;
    assignmentId: mongoose.Types.ObjectId;
    sqlQuery: string;
    isCompleted: boolean;
    attemptCount: number;
    lastAttempt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserProgressSchema: Schema = new Schema({
    userId: { type: String, required: true },
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    sqlQuery: { type: String, default: '' },
    isCompleted: { type: Boolean, default: false },
    attemptCount: { type: Number, default: 0 },
    lastAttempt: { type: Date, default: Date.now }
}, { timestamps: true });

UserProgressSchema.index({ userId: 1, assignmentId: 1 }, { unique: true });

export default mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
