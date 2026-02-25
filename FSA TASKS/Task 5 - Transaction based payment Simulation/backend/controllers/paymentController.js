const db = require("../config/db");

exports.makePayment = async (req, res) => {
    const { userId, merchantId, amount } = req.body;

    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        const [user] = await conn.query(
            "SELECT balance FROM users WHERE id=? FOR UPDATE",
            [userId]
        );

        if (user[0].balance < amount)
            throw new Error("Insufficient Balance");

        await conn.query(
            "UPDATE users SET balance = balance - ? WHERE id=?",
            [amount, userId]
        );

        await conn.query(
            "UPDATE merchants SET balance = balance + ? WHERE id=?",
            [amount, merchantId]
        );

        await conn.query(
            "INSERT INTO transactions(user_id, merchant_id, amount, status) VALUES(?,?,?,?)",
            [userId, merchantId, amount, "SUCCESS"]
        );

        await conn.commit();

        res.json({ message: "Payment Successful" });

    } catch (err) {
        await conn.rollback();

        await conn.query(
            "INSERT INTO transactions(user_id, merchant_id, amount, status) VALUES(?,?,?,?)",
            [userId, merchantId, amount, "FAILED"]
        );

        res.json({ message: "Payment Failed: " + err.message });
    } finally {
        conn.release();
    }
};
