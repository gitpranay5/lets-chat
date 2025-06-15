import express from "express";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";

// ✅ Load `.env` file
dotenv.config({ path: "/app/.env" });

/* ✅ Check if .env.local exists before loading
//const envPath = "/app/.env.local";
//if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log("🔍 Environment Variables Loaded Successfully");
} else {
  console.error("❌ Error: .env.local file not found!");
  process.exit(1);
}

// ✅ Remove `REACT_APP_` prefix for Firebase variables
Object.keys(process.env).forEach((key) => {
  if (key.startsWith("REACT_APP_")) {
    const newKey = key.replace("REACT_APP_", "");
    process.env[newKey] = process.env[key];
  }
});

// ✅ Log key environment variables for debugging
console.log("🔍 AZURE_SQL_CONNECTION_STRING:", process.env.AZURE_SQL_CONNECTION_STRING ? "✅ Loaded" : "❌ Missing");
console.log("🔍 FIREBASE_API_KEY:", process.env.FIREBASE_API_KEY ? "✅ Loaded" : "❌ Missing");
*/

import { Server } from "socket.io";
import sequelize from "./config/database.js";
// ✅ Handle database connection errors gracefully
sequelize.authenticate()
  .then(() => console.log("✅ Connected to Azure SQL Database"))
  .catch((error) => {
    console.error("❌ Database connection error:", error);
    process.exit(1);  // ✅ Exit if DB connection fails
  });


import { VerifyToken, VerifySocketToken } from "./middlewares/VerifyToken.js";
import chatRoomRoutes from "./routes/chatRoom.js";
import chatMessageRoutes from "./routes/chatMessage.js";
import userRoutes from "./routes/user.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(VerifyToken);

const PORT = process.env.PORT || 8080;

// ✅ Apply Token Middleware only to protected routes
app.use("/api/room", chatRoomRoutes);
app.use("/api/message", chatMessageRoutes);
app.use("/api/user", userRoutes);

// ✅ Create HTTP Server for Socket.io
const server = createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: process.env.FRONTEND_URL || "http://localhost:3000", 
    credentials: true,
  }
});

io.use(VerifySocketToken);

global.onlineUsers = new Map();

const getKey = (map, val) => {
  for (let [key, value] of map.entries()) {
    if (value === val) return key;
  }
};

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("getUsers", Array.from(onlineUsers));
  });

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const sendUserSocket = onlineUsers.get(receiverId);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("getMessage", {
        senderId,
        message,
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(getKey(onlineUsers, socket.id));
    socket.emit("getUsers", Array.from(onlineUsers));
  });
});

server.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));

