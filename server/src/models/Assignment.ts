import mongoose, { Schema, Document } from 'mongoose';

export interface ITableMetadata {
    tableName: string;
    createTableQuery: string;
    insertDataQuery: string;
    sampleData: any[];
}

export interface IAssignment extends Document {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    question: string;
    solutionQuery: string;
    tableMetadata: ITableMetadata[];
    createdAt: Date;
    updatedAt: Date;
}

const TableMetadataSchema = new Schema<ITableMetadata>({
    tableName: { type: String, required: true },
    createTableQuery: { type: String, required: true },
    insertDataQuery: { type: String, required: true },
    sampleData: [Schema.Types.Mixed]
});

const AssignmentSchema = new Schema<IAssignment>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    question: { type: String, required: true },
    solutionQuery: { type: String, required: true },
    tableMetadata: [TableMetadataSchema]
}, { timestamps: true });

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
