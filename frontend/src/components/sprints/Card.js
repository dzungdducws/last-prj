"use client";

import { useEffect } from "react";

export default function Card({ task }) {
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);

    // Lấy các giá trị cần thiết
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    // Ghép thành chuỗi định dạng
    return `${hours}:${minutes}-${day}/${month}/${year}`;
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer border border-gray-200">
      <h3 className="text-gray-900 font-semibold text-lg mb-2">
        {task.task_title}
      </h3>
      <p className="text-gray-600 text-xs mb-1">
        <span className="font-medium text-xs">Hạn:</span>{" "}
        {formatDateTime(task.due_date)}
      </p>
      <p className="text-gray-600 text-xs">
        <span className="font-medium text-xs">Ngày tạo:</span>{" "}
        {formatDateTime(task.created_at)}
      </p>
    </div>
  );
}
