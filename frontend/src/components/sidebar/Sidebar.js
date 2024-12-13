"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Dùng useRouter từ Next.js
import api from "@/config/axiosConfig"; // Giả sử bạn có axios config sẵn
import RoomList from "@/components/sidebar/RoomList"; // Phần hiển thị danh sách phòng

export default function Sidebar() {
  const [username, setUsername] = useState("");
  const [rooms, setRooms] = useState([]);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter(); // Lấy router để theo dõi sự thay đổi đường dẫn

  // Lắng nghe sự thay đổi router và cập nhật Sidebar khi cần
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLogin(false);
      router.replace("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsername(response.data.username);

        const res = await api.get(
          `/users/view_room_by_id?user_id=${response.data.user_id}`
        );
        setRooms(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng hoặc phòng:", error);
        localStorage.removeItem("token");
        setIsLogin(false);
        router.replace("/login");
      }
    };

    fetchUserData();
  }, []);
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
