import mongoose from 'mongoose';
import { config } from '../config/index/envconfig.js';
import Assignment from '../models/Assignment.js';

const sampleAssignments = [
    {
        title: 'Find All Students',
        description: 'A basic query to retrieve all student records.',
        difficulty: 'Easy',
        question: 'Write a query to select all columns from the students table.',
        solutionQuery: 'SELECT * FROM students;',
        expectedOutput: {
            type: 'table',
            value: [
                { id: 1, name: 'Alice', age: 20, grade: 'A' },
                { id: 2, name: 'Bob', age: 22, grade: 'B' },
                { id: 3, name: 'Charlie', age: 21, grade: 'A' }
            ]
        },
        tableMetadata: [
            {
                tableName: 'students',
                createTableQuery: `
          CREATE TABLE IF NOT EXISTS students (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            age INTEGER,
            grade VARCHAR(10)
          );
        `,
                insertDataQuery: `
          INSERT INTO students (name, age, grade) VALUES
          ('Alice', 20, 'A'),
          ('Bob', 22, 'B'),
          ('Charlie', 21, 'A');
        `,
                sampleData: [
                    { id: 1, name: 'Alice', age: 20, grade: 'A' },
                    { id: 2, name: 'Bob', age: 22, grade: 'B' },
                    { id: 3, name: 'Charlie', age: 21, grade: 'A' }
                ]
            }
        ]
    },
    {
        title: 'High Achievers',
        description: 'Filtering students based on their grade.',
        difficulty: 'Easy',
        question: "Find all students who have an 'A' grade.",
        solutionQuery: "SELECT name FROM students WHERE grade = 'A';",
        expectedOutput: {
            type: 'table',
            value: [
                { name: 'Alice' },
                { name: 'Charlie' }
            ]
        },
        tableMetadata: [
            {
                tableName: 'students',
                createTableQuery: `
          CREATE TABLE IF NOT EXISTS students (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            age INTEGER,
            grade VARCHAR(10)
          );
        `,
                insertDataQuery: `
          INSERT INTO students (name, age, grade) VALUES
          ('Alice', 20, 'A'),
          ('Bob', 22, 'B'),
          ('Charlie', 21, 'A');
        `,
                sampleData: [
                    { id: 1, name: 'Alice', age: 20, grade: 'A' },
                    { id: 2, name: 'Bob', age: 22, grade: 'B' },
                    { id: 3, name: 'Charlie', age: 21, grade: 'A' }
                ]
            }
        ]
    }
];

export const seedDatabase = async () => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(config.mongodb.uri);
        }

        console.log('🌱 Seeding assignments with expected outputs...');

        await Assignment.deleteMany({});
        await Assignment.insertMany(sampleAssignments);

        console.log('✅ Sample assignments seeded successfully.');
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        throw error;
    }
};

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.includes('seed.ts')) {
    seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}
