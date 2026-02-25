const express = require('express');
const db = require('./db');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

/* All Orders */
app.get('/orders', (req,res)=>{
    const sql = `
    SELECT c.name,p.product_name,o.quantity,p.price,
    (o.quantity*p.price) AS total,o.order_date
    FROM orders o
    JOIN customers c ON o.customer_id=c.customer_id
    JOIN products p ON o.product_id=p.product_id
    ORDER BY o.order_date DESC`;

    db.query(sql,(err,result)=>{
        if(err) throw err;
        res.json(result);
    });
});

/* Highest Order */
app.get('/highest', (req,res)=>{
    const sql = `
    SELECT c.name,(o.quantity*p.price) AS total
    FROM orders o
    JOIN customers c ON o.customer_id=c.customer_id
    JOIN products p ON o.product_id=p.product_id
    ORDER BY total DESC LIMIT 1`;

    db.query(sql,(err,result)=>{
        if(err) throw err;
        res.json(result);
    });
});

/* Most Active Customer */
app.get('/active', (req,res)=>{
    const sql = `
    SELECT c.name,COUNT(o.order_id) AS orders
    FROM customers c
    JOIN orders o ON c.customer_id=o.customer_id
    GROUP BY c.customer_id
    ORDER BY orders DESC LIMIT 1`;

    db.query(sql,(err,result)=>{
        if(err) throw err;
        res.json(result);
    });
});

app.listen(3000,()=>console.log("Server running on port 3000"));
