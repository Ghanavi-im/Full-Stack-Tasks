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
  password: "naveen",
  database: "student_schema"
});

db.connect(err=>{
  if(err) throw err;
  console.log("Database Connected");
});

/* LOGIN API */
app.post("/login",(req,res)=>{
  const {email,password} = req.body;

  if(!email || !password){
    return res.json({status:"error",message:"All fields required"});
  }

  const sql="SELECT * FROM users WHERE email=? AND password=?";
  db.query(sql,[email,password],(err,result)=>{
    if(err) throw err;

    if(result.length>0)
      res.json({status:"success"});
    else
      res.json({status:"error",message:"Invalid credentials"});
  });
});

app.listen(3000,()=>console.log("Server running on port 3000"));
