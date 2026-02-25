const express = require("express");
const cors = require("cors");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", paymentRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
