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
  origin: 'http://localhost:5173',
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());


app.use("/api/users", userRoutes); 
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res)=>{
  res.json({"admin": "sameer faridi", "project": "movie booking backend"})
}) 




const PORT = process.env.PORT || 6699;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
