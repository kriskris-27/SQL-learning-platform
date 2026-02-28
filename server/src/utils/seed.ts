import mongoose from 'mongoose';
import { config } from '../config/index/envconfig.js';
import Assignment from '../models/Assignment.js';

const rawData = [
    {
        "title": "Find High Salary Employees",
        "difficulty": "Easy",
        "question": "List all employees earning more than 50,000",
        "description": "A basic filtering exercise using the WHERE clause.",
        "solutionQuery": "SELECT * FROM employees WHERE salary > 50000;",
        "sampleTables": [
            {
                "tableName": "employees",
                "columns": [
                    { "columnName": "id", "dataType": "INTEGER" },
                    { "columnName": "name", "dataType": "TEXT" },
                    { "columnName": "salary", "dataType": "INTEGER" },
                    { "columnName": "department", "dataType": "TEXT" }
                ],
                "rows": [
                    { "id": 1, "name": "Alice", "salary": 45000, "department": "HR" },
                    { "id": 2, "name": "Bob", "salary": 60000, "department": "Engineering" },
                    { "id": 3, "name": "Charlie", "salary": 75000, "department": "Engineering" },
                    { "id": 4, "name": "Diana", "salary": 48000, "department": "Sales" }
                ]
            }
        ],
        "expectedOutput": {
            "type": "table",
            "value": [
                { "id": 2, "name": "Bob", "salary": 60000, "department": "Engineering" },
                { "id": 3, "name": "Charlie", "salary": 75000, "department": "Engineering" }
            ]
        }
    },
    {
        "title": "Department-wise Employee Count",
        "difficulty": "Medium",
        "question": "Find the number of employees in each department",
        "description": "Practice using GROUP BY and aggregate functions like COUNT().",
        "solutionQuery": "SELECT department, COUNT(*) as count FROM employees GROUP BY department;",
        "sampleTables": [
            {
                "tableName": "employees",
                "columns": [
                    { "columnName": "id", "dataType": "INTEGER" },
                    { "columnName": "name", "dataType": "TEXT" },
                    { "columnName": "department", "dataType": "TEXT" }
                ],
                "rows": [
                    { "id": 1, "name": "Alice", "department": "HR" },
                    { "id": 2, "name": "Bob", "department": "Engineering" },
                    { "id": 3, "name": "Charlie", "department": "Engineering" },
                    { "id": 4, "name": "Diana", "department": "Sales" },
                    { "id": 5, "name": "Eve", "department": "Sales" }
                ]
            }
        ],
        "expectedOutput": {
            "type": "table",
            "value": [
                { "department": "HR", "count": 1 },
                { "department": "Engineering", "count": 2 },
                { "department": "Sales", "count": 2 }
            ]
        }
    },
    {
        "title": "Total Order Value per Customer",
        "difficulty": "Medium",
        "question": "Find total order value for each customer",
        "description": "An exercise in joining two tables and calculating sums.",
        "solutionQuery": "SELECT c.name, SUM(o.amount) as total_amount FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.name;",
        "sampleTables": [
            {
                "tableName": "customers",
                "columns": [
                    { "columnName": "id", "dataType": "INTEGER" },
                    { "columnName": "name", "dataType": "TEXT" }
                ],
                "rows": [
                    { "id": 1, "name": "Aman" },
                    { "id": 2, "name": "Saurabh" }
                ]
            },
            {
                "tableName": "orders",
                "columns": [
                    { "columnName": "id", "dataType": "INTEGER" },
                    { "columnName": "customer_id", "dataType": "INTEGER" },
                    { "columnName": "amount", "dataType": "REAL" }
                ],
                "rows": [
                    { "id": 1, "customer_id": 1, "amount": 1200.5 },
                    { "id": 2, "customer_id": 1, "amount": 800.0 },
                    { "id": 3, "customer_id": 2, "amount": 1500.0 }
                ]
            }
        ],
        "expectedOutput": {
            "type": "table",
            "value": [
                { "name": "Aman", "total_amount": 2000.5 },
                { "name": "Saurabh", "total_amount": 1500.0 }
            ]
        }
    },
    {
        "title": "Highest Paid Employee",
        "difficulty": "Hard",
        "question": "Find the employee(s) with the highest salary",
        "description": "Utilize subqueries to find the maximum value from a table.",
        "solutionQuery": "SELECT * FROM employees WHERE salary = (SELECT MAX(salary) FROM employees);",
        "sampleTables": [
            {
                "tableName": "employees",
                "columns": [
                    { "columnName": "id", "dataType": "INTEGER" },
                    { "columnName": "name", "dataType": "TEXT" },
                    { "columnName": "salary", "dataType": "INTEGER" }
                ],
                "rows": [
                    { "id": 1, "name": "Alice", "salary": 70000 },
                    { "id": 2, "name": "Bob", "salary": 85000 },
                    { "id": 3, "name": "Charlie", "salary": 85000 }
                ]
            }
        ],
        "expectedOutput": {
            "type": "table",
            "value": [
                { "id": 2, "name": "Bob", "salary": 85000 },
                { "id": 3, "name": "Charlie", "salary": 85000 }
            ]
        }
    }
];

const transformData = (data: any) => {
    return data.map((item: any) => ({
        title: item.title,
        description: item.description,
        difficulty: item.difficulty,
        question: item.question,
        solutionQuery: item.solutionQuery,
        expectedOutput: item.expectedOutput,
        tableMetadata: item.sampleTables.map((table: any) => {
            const colDefs = table.columns.map((c: any) => `${c.columnName} ${c.dataType}`).join(', ');
            const createQuery = `CREATE TABLE IF NOT EXISTS ${table.tableName} (${colDefs});`;

            const colNames = table.columns.map((c: any) => c.columnName).join(', ');
            const valPlaceholders = table.rows.map((row: any) => {
                const vals = table.columns.map((c: any) => {
                    const val = row[c.columnName];
                    return typeof val === 'string' ? `'${val}'` : val;
                }).join(', ');
                return `(${vals})`;
            }).join(', ');

            const insertQuery = `INSERT INTO ${table.tableName} (${colNames}) VALUES ${valPlaceholders};`;

            return {
                tableName: table.tableName,
                createTableQuery: createQuery,
                insertDataQuery: insertQuery,
                sampleData: table.rows
            };
        })
    }));
};

export const seedDatabase = async () => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(config.mongodb.uri);
        }

        console.log('🌱 Seeding assignments from enhanced dataset...');

        const formattedAssignments = transformData(rawData);

        await Assignment.deleteMany({});
        await Assignment.insertMany(formattedAssignments);

        console.log('✅ Sample assignments seeded successfully.');
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        throw error;
    }
};

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.includes('seed.ts')) {
    seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}
