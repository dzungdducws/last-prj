"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/config/axiosConfig";
import RoomList from "@/components/sidebar/RoomList";
import { useUser } from "@/context/UserContext";

export default function Sidebar() {
  const { username, userId } = useUser();

  const [rooms, setRooms] = useState([]);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLogin(false);
      router.replace("/login");
      return;
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const res = await api.get(`/users/view_room_by_id?user_id=${userId}`);
          setRooms(res.data);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng hoặc phòng:", error);
          localStorage.removeItem("token");
          setIsLogin(false);
          router.replace("/login");
        }
      }
    };

    fetchUserData();
  }, [userId]);

  const logout = () => {
    localStorage.removeItem("token");
    setIsLogin(false);
    router.replace("/login");
  };

  if (!isLogin) return null;

  return (
    <div className="h-screen min-w-64 w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-lg font-bold border-b border-gray-500">
        <a href="/dashboard">Trang chủ</a>
      </div>
      <div className="p-4 text-lg font-bold border-b border-gray-500">
        {username || "Loading..."}
      </div>
      <nav className="flex-grow p-4 h-[65%] overflow-y-auto scrollbar">
        <ul className="space-y-2">
          <RoomList rooms={rooms} />
        </ul>
      </nav>
      <div className="p-4 text-lg font-bold border-t border-gray-500">
        <button
          onClick={logout}
          type="button"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
