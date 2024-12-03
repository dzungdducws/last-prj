"use client";

import api from "@/config/axiosConfig";
import React, { useEffect, useState } from "react";

export default function RoomDetailPage({ params }) {
  const room_id = params.room_id;
  const [userId, setUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0); 
  const [limit, setLimit] = useState(5); 
  const [totalMessages, setTotalMessages] = useState(0); 
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem("token");
      const response = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserId(response.data.user_id);
    };

    fetchUserId();
  }, []);

  const fetchMessages = async (currentPage) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const res = await api.get(
      `/messages/view_message_by_room_id?room_id=${room_id}&limit=${limit}&offset=${
        currentPage * limit
      }`
    );
    res.data.messages.reverse();
    
    if (res.data.messages.length === 0) {
      setHasMore(false);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        ...res.data.messages,
      ]);
    }

    setTotalMessages(res.data.total_messages);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMessages(page);
  }, [room_id, page]);

  useEffect(() => {
    const handleScroll = () => {
      console.log(1);
      
      if (window.scrollY === 0 && hasMore && !isLoading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, isLoading]);

  return (
    <div className="grid grid-cols-1 gap-4">
      {messages.map((message) => {
        const isUserMessage = message.user_id === userId;
        return (
          <div
            className={`h-fit flex ${
              isUserMessage ? "justify-end" : "justify-start"
            }`}
            key={message.message_id}
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
      {isLoading && <p className="text-center">Đang tải thêm...</p>}
    </div>
  );
}
