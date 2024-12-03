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
    <></>
  );
}
