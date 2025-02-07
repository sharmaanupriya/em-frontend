import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Use backend URL in production

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
