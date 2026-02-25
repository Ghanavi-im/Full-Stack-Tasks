const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "naveen",
  database: "student_schema"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected");
});

/* GET STUDENTS */
app.get("/students", (req, res) => {
  const { sort, dept } = req.query;

  let query = "SELECT * FROM students";

  if (dept && dept !== "All")
    query += ` WHERE department='${dept}'`;

  if (sort === "name")
    query += " ORDER BY name ASC";
  else if (sort === "date")
    query += " ORDER BY join_date ASC";

  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

/* COUNT PER DEPARTMENT */
app.get("/counts", (req, res) => {
  db.query(
    "SELECT department, COUNT(*) as total FROM students GROUP BY department",
    (err, result) => {
      if (err) throw err;
      res.json(result);
    }
  );
});

app.listen(3000, () => console.log("Server running on port 3000"));
