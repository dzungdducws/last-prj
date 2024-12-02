"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "../../config/axiosConfig";
import SidebarWithContentSeparator from "@/component/SidebarWithContentSeparator";

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true); // Loading state for fetching user data
  const [error, setError] = useState(null); // To store error messages if any

  useEffect(() => {
    console.log(router);

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
          setError("Không thể lấy thông tin người dùng.");
          localStorage.removeItem("token");
          router.replace("/login");
        } finally {
          setLoading(false); // Set loading to false once the data is fetched or error occurs
        }
      };

      fetchUserData();
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    router.replace("/login");
  }, [router]);

  return (
    <>
      <SidebarWithContentSeparator />
    </>
  );
}
