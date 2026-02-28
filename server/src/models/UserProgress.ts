import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProgress extends Document {
    userId: string;
    assignmentId: mongoose.Types.ObjectId;
    lastQuery: string;
    isSolved: boolean;
    updatedAt: Date;
}

const UserProgressSchema: Schema = new Schema({
    userId: { type: String, required: true },
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    lastQuery: { type: String, default: '' },
    isSolved: { type: Boolean, default: false },
}, { timestamps: true });

// Ensure a unique entry per user per assignment
UserProgressSchema.index({ userId: 1, assignmentId: 1 }, { unique: true });

export default mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
