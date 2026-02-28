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
    expectedOutput: {
        type: 'table' | 'single_value' | 'column' | 'count' | 'row';
        value: any;
    };
    createdAt: Date;
    updatedAt: Date;
}

const TableMetadataSchema = new Schema({
    tableName: { type: String, required: true },
    createTableQuery: { type: String, required: true },
    insertDataQuery: { type: String, required: true },
    sampleData: { type: [Schema.Types.Mixed], required: true }
}, { _id: false });

const AssignmentSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    question: { type: String, required: true },
    solutionQuery: { type: String, required: true },
    tableMetadata: { type: [TableMetadataSchema], required: true },
    expectedOutput: {
        type: { type: String, enum: ['table', 'single_value', 'column', 'count', 'row'], required: true },
        value: { type: Schema.Types.Mixed, required: true }
    }
}, { timestamps: true });

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
