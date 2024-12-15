"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import { UserProvider } from "@/context/UserContext";

export default function Home() {
  return (
    <>
      <UserProvider>
        <Sidebar />
      </UserProvider>
    </>
  );
}
