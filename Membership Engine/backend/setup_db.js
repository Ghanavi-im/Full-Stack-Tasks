const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function run() {
    try {
        console.log('Connecting to MySQL...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true // need this to run multiple SQL queries from the file
        });

        const schemaFile = path.join(__dirname, '../database/schema.sql');
        console.log('Reading schema from', schemaFile);
        const schema = fs.readFileSync(schemaFile, 'utf8');

        console.log('Executing schema...');
        await connection.query(schema);

        console.log('Database and tables created successfully!');
        await connection.end();
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
