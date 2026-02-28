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

const seedDatabase = async () => {
    try {
        await mongoose.connect(config.mongodb.uri);
        console.log('Connected to MongoDB for seeding...');

        await Assignment.deleteMany({});
        console.log('Cleared existing assignments.');

        await Assignment.insertMany(sampleAssignments);
        console.log('✅ Sample assignments seeded successfully.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seedDatabase();
