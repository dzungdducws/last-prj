"use client";
// components/Chat.js
import { useEffect, useState } from "react";

export default function Chat() {
  const [clientId, setClientId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const client_id = Date.now(); // Generate a unique client ID
    setClientId(client_id);

    const websocket = new WebSocket(`ws://localhost:8082/ws/${client_id}`);

    websocket.onmessage = (event) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: event.data, timestamp: new Date().toISOString() },
      ]);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    if (ws && messageText.trim()) {
      ws.send(messageText);
      setMessageText(""); // Clear input after sending
    }
  };

  return (
    <div>
      <h1>WebSocket Chat</h1>
      <h2>
        Your ID: <span>{clientId}</span>
      </h2>

      <form onSubmit={sendMessage}>
        <input
          type="text"
          id="messageText"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          autoComplete="off"
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>

      <ul id="messages">
        {messages.map((message, index) => (
          <li key={index}>
            <strong>{message.timestamp}:</strong> {message.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
