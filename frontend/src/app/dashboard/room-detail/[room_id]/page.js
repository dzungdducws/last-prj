"use client";

import ChatRoom from "@/components/chatroom/ChatRoom";
import SprintsComponent from "@/components/sprints/SprintsComponent";
import UMComponent from "@/components/usermanager/UMComponent";
import React, { useEffect, useState } from "react";
import { UserProvider } from "@/context/UserContext";

export default function RoomDetailPage({ params }) {
  const [type, setType] = useState(0);

  const renderComponent = (type, params) => {
    switch (type) {
      case 0:
        return <ChatRoom params={params} />;
      case 1:
        return <SprintsComponent params={params}></SprintsComponent>;
      case 2:
        return <UMComponent params={params}></UMComponent>;
      default:
        return <DefaultComponent />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <nav className="bg-gray-800 h-fit">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <button
                    className={
                      type == 0
                        ? "rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                        : "rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                    onClick={() => {
                      setType(0);
                    }}
                  >
                    Phòng trò chuyện
                  </button>
                  <button
                    className={
                      type == 1
                        ? "rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                        : "rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                    onClick={() => {
                      setType(1);
                    }}
                  >
                    Quản lý công việc
                  </button>
                  <button
                    className={
                      type == 2
                        ? "rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                        : "rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                    onClick={() => {
                      setType(2);
                    }}
                  >
                    Danh sách thành viên
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <UserProvider>{renderComponent(type, params)}</UserProvider>
    </div>
  );
}
  