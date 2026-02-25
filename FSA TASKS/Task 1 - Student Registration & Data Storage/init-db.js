const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ghxnxvi@965218"
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL server:", err);
        process.exit(1);
    }

    console.log("Connected to MySQL server.");

    connection.query("CREATE DATABASE IF NOT EXISTS student_schema", (err) => {
        if (err) {
            console.error("Error creating database:", err);
            connection.end();
            process.exit(1);
        }
        console.log("Database 'student_schema' created or already exists.");

        connection.query("USE student_schema", (err) => {
            if (err) {
                console.error("Error switching to database:", err);
                connection.end();
                process.exit(1);
            }

            const createTableQuery = `
        CREATE TABLE IF NOT EXISTS student_register (
          id INT AUTO_INCREMENT PRIMARY KEY,
          Username VARCHAR(255) NOT NULL,
          Email VARCHAR(255) NOT NULL,
          DOB VARCHAR(255),
          Department VARCHAR(255),
          Phone VARCHAR(255)
        )
      `;

            connection.query(createTableQuery, (err) => {
                if (err) {
                    console.error("Error creating table:", err);
                } else {
                    console.log("Table 'student_register' created or already exists.");
                }

                connection.end();
                console.log("Database initialization complete.");
            });
        });
    });
});
