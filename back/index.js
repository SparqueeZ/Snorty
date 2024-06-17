const express = require("express");
const connectDB = require("./config/db");
const cors = require("./middlewares/corsMiddleware");
const exportRoutes = require("./routes/exportRoutes");
const dataRoutes = require("./routes/dataRoutes");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors);
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/export", exportRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Snorty API");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
