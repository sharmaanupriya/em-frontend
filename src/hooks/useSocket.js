import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// const socket = io("http://localhost:5000"); // Use backend URL in production
const SOCKET_URL = "https://em-backend-wcn4.onrender.com"; // ✅ Correct WebSocket URL

const socket = io(SOCKET_URL, {
    path: "/socket.io/",
    transports: ["websocket", "polling"], // ✅ Allow fallback if WebSockets fail
    withCredentials: true,
    auth: {
        token: localStorage.getItem("token") // ✅ Send token for authentication
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000
});

socket.on("connect", () => {
    console.log("✅ WebSocket Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
    console.log("❌ WebSocket Disconnected:", reason);
    if (reason === "io server disconnect") {
        socket.connect(); // ✅ Try reconnecting if disconnected by server
    }
});

const useSocket = () => {
    const [attendees, setAttendees] = useState({});

    useEffect(() => {
        socket.on("update_attendees", ({ eventId, count }) => {
            setAttendees((prev) => ({ ...prev, [eventId]: count }));
        });

        return () => {
            socket.off("update_attendees");
        };
    }, []);

    return { attendees, socket };
};

export default useSocket;
