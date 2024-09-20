const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");


dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
const PORT = process.env.PORT || 6699;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});