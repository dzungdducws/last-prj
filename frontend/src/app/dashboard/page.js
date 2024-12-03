"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "../../config/axiosConfig";
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  const router = useRouter();
  useEffect(() => {
    
  }, [router]);

  return (
    <div className="p-4 m-64">
      <h1 className="text-2xl font-bold">Room Detail</h1>
      <p>Room ID:</p>
    </div>
  );
}
