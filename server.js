import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import "./config/db.js";

const PORT = process.env.PORT || 5001;

// CREATE HTTP SERVER
const server = http.createServer(app);

// SOCKET.IO SETUP
const io = new Server(server, {
    cors: {
        origin: [
            "https://frontend-transport-managementqa.onrender.com",
            "http://localhost:5173",
            "http://localhost:3000"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
    transports: ["websocket", "polling"],
    allowEIO3: true
});

// EXPORT IO
export { io };

// SOCKET CONNECTION
io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});

// START SERVER
server.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});