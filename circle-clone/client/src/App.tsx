import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER || "http://localhost:3000");

export default function App() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<any[]>([]);

  useEffect(() => {
    socket.on("message", (msg) => setChat((prev) => [...prev, msg]));
    return () => { socket.off("message"); };
  }, []);

  const joinRoom = () => {
    socket.emit("joinRoom", room);
  };

  const sendMessage = () => {
    socket.emit("message", { roomId: room, message });
    setMessage("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Circle Clone</h1>
      <input placeholder="Room ID" value={room} onChange={(e) => setRoom(e.target.value)} />
      <button onClick={joinRoom}>Join</button>
      <div>
        <input placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Chat</h2>
        {chat.map((c, i) => <div key={i}><b>{c.sender}:</b> {c.message}</div>)}
      </div>
    </div>
  );
}
