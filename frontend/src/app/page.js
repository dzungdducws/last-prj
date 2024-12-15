"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import { UserProvider } from "@/context/UserContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    router.replace("/dashboard");
  }, []);

  return (
    <>
      <UserProvider>
        <Sidebar />
      </UserProvider>
    </>
  );
}
