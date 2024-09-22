const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); 
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes"); 
const { initSocket } = require("./config/socket"); 
const http = require("http");

dotenv.config();
connectDB();



const app = express();
const server = http.createServer(app); 

const io = initSocket(server); 
app.set("io", io);


app.use(cors());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST"],
  credentials: true,
}));

app.use(express.json());


app.use("/api/users", userRoutes); //Auth routes
app.use("/api/bookings", bookingRoutes); //all other routes

app.get("/", (req, res)=>{
  res.json({"status": "Backend alive", "project": "movie booking backend"})
}) 




const PORT = process.env.PORT || 6699;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
