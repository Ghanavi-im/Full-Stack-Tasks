const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ghxnxvi@965218",
  database: "student_schema"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed");
    console.log(err);
  } else {
    console.log("Database connected");
  }
});

app.post("/login", (req, res) => {
  const Username = req.body.Username;
  const Email = req.body.Email;
  const DOB = req.body.DOB;
  const Department = req.body.Department;
  const Phone = req.body.Phone;

  const sql = `
    INSERT INTO student_register 
    (Username, Email, DOB, Department, Phone) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [Username, Email, DOB, Department, Phone], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ message: "Database error" });
    }

    res.json({ message: "Registration successful" });
  });
});


// START SERVER (MOST IMPORTANT)
app.listen(3000, () => {
  console.log("Server started on port 3000");
});