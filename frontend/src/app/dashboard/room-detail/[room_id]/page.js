"use client";

import api from "@/config/axiosConfig";
import React, { useEffect, useState } from "react";

export default function RoomDetailPage({ params }) {
  const room_id = params.room_id;
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");

  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [totalMessages, setTotalMessages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [ws, setWs] = useState(null);
  const [messageText, setMessageText] = useState("");

  const fetchMessages = async (currentPage, currentRoomId) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const res = await api.get(
        `/messages/view_message_by_room_id?room_id=${currentRoomId}&limit=${limit}&offset=${
          currentPage * limit
        }`
      );

      const newMessages = res.data.messages.reverse();
      setMessages((prevMessages) => {
        const uniqueMessages = [];
        const messageIds = new Set(prevMessages.map((msg) => msg.message_id));

        newMessages.forEach((msg) => {
          if (!messageIds.has(msg.message_id)) {
            uniqueMessages.push(msg);
            messageIds.add(msg.message_id);
          }
        });

        return [...uniqueMessages, ...prevMessages];
      });

      if (newMessages.length === 0) {
        setHasMore(false);
      }

      setTotalMessages(res.data.total_messages);
    } catch (error) {
      console.error("Error fetching messages: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(response.data.user_id);
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching user ID: ", error);
      }
    };

    fetchUserId();

    const websocket = new WebSocket(
      `ws://localhost:8004/ws/chat_room/${room_id}`
    );

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setMessages((prevMessages) => [...prevMessages, data]);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    if (ws && messageText.trim()) {
      const message = JSON.stringify({
        messageText: messageText,
        user_id: userId,
        username: username,
      });
      ws.send(message);
      setMessageText("");
    }
  };

  useEffect(() => {
    setMessages([]);
    setPage(0);
    setTotalMessages(0);
    setHasMore(true);
    fetchMessages(0, room_id);
  }, [room_id]);

  useEffect(() => {
    fetchMessages(page, room_id);
  }, [page, room_id]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <button
        onClick={() => {
          const nextPage = page + 1;
          setPage(nextPage);
        }}
        disabled={totalMessages - (page + 1) * limit == 0}
        className="w-full py-2 px-4 bg-blue-200 text-white rounded-lg"
      >
        {totalMessages - (page + 1) * limit === 0
          ? "Hết tin nhắn; không thể tải thêm"
          : `Còn ${
              totalMessages - (page + 1) * limit
            }; bấm vào đây để tải thêm`}
      </button>
      {isLoading && <p className="text-center">Đang tải thêm...</p>}
      {messages.map((message, index) => {
        const isUserMessage = message.user_id === userId;
        return (
          <div
            className={`h-fit flex ${
              isUserMessage ? "justify-end" : "justify-start"
            }`}
            key={`${message.message_id}-${index}`}
          >
            <div className="w-3/4">
              <p className="text-sm text-gray-600">
                {message.user_name} vào lúc {message.created_at}:
              </p>
              <button
                className={`w-full py-2 px-4 text-left rounded-lg ${
                  isUserMessage
                    ? "bg-blue-100 text-right"
                    : "bg-blue-600 text-white"
                }`}
              >
                {message.message_detail}
              </button>
            </div>
          </div>
        );
      })}
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
    </div>
  );
}
