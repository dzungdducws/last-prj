"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Modal, Input, Select } from "antd";
// components/UserDetailPopup.js

const UserDetailPopup = ({ isOpen, onClose, user }) => {
  const [localPoints, setLocalPoints] = useState(user.points);

  const handleAddPoints = () => {
    const newPoints = localPoints + 10; // Thêm 10 điểm mỗi lần nhấn
    setLocalPoints(newPoints);
    onAddPoints(newPoints); // Gửi điểm mới lên parent component
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="mt-4">
          <p className="text-sm">
            <strong>Name:</strong> {user.name}
          </p>
          <p className="text-sm">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-sm">
            <strong>Points:</strong> {localPoints}
          </p>
        </div>
        <div className="flex justify-center items-center gap-4">
          <div className="mt-4 text-center">
            <button
              onClick={handleAddPoints}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Xóa thành viên
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={handleAddPoints}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Thêm điểm
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Đóng
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default function UMComponent() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const userssss = {
    name: "John Doe",
    email: "johndoe@example.com",
    points: 120,
  };

  const handleAddPoints = (newPoints) => {
    setUser((prevUser) => ({
      ...prevUser,
      points: newPoints,
    }));
  };

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  const [open, setOpen] = useState(false);
  const handleCancel = () => {
    setOpen(false);
    setUsers({});
  };
  const members = [
    { id: 1, name: "Nguyễn Văn A" },
    { id: 2, name: "Trần Thị B" },
    { id: 3, name: "Lê Văn C" },
  ];

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [
      { user_id: 1, username: "Alice", email: "alice@example.com" },
      { user_id: 2, username: "Bob", email: "bob@example.com" },
      { user_id: 3, username: "Charlie", email: "charlie@example.com" },
      { user_id: 4, username: "Diana", email: "diana@example.com" },
      { user_id: 5, username: "Eve", email: "eve@example.com" },
    ];
    setUsers(storedUsers);
  }, []);

  const handleDelete = (id) => {
    const updatedUsers = users.filter((user) => user.user_id !== id);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };
  const handleOk = async () => {
    setOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách người dùng</h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Thêm người dùng
        </button>
      </div>

      <Modal
        title="Thêm thành viên mới"
        open={open}
        onCancel={handleCancel}
        footer={
          <button
            onClick={handleOk}
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Thêm
          </button>
        }
      >
        {/* Người được bàn giao */}
        <div>
          <label
            htmlFor="assignee"
            className="block text-sm font-medium text-gray-700"
          >
            Thành viên thêm mới
          </label>
          <select
            id="assignee"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          >
            <option value="">Chọn thành viên...</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
      </Modal>

      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Tên</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-center">{user.user_id}</td>
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <UserDetailPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        user={userssss}
      />
    </div>
  );
}
