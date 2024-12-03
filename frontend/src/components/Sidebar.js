//Sidebar.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../config/axiosConfig";

export default function Sidebar() {
  const [username, setUsername] = useState("");

  const router = useRouter();

  if (typeof window !== "undefined") {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsername(response.data.username);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        localStorage.removeItem("token");
        router.replace("/login");
      }
    };

    fetchUserData();
  }

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-lg font-bold border-b border-gray-500">
        {username}
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/" className="block p-2 rounded hover:bg-gray-700">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="block p-2 rounded hover:bg-gray-700">
              About
            </Link>
          </li>
          <li>
            <Link
              href="/services"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 text-lg font-bold border-t border-gray-500">
        <button
          onClick={() => logout()}
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg "
        >
          logout
        </button>
      </div>
    </div>
  );
}
