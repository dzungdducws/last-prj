"use client";

import api from "@/config/axiosConfig";
import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

import KanbanBoard from "./KanbanBoard";

import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Space, Modal } from "antd";

export default function SprintsComponent({ params }) {
  const room_id = params.room_id;
  const { username, userId } = useUser();
  const [roleDetail, setRoleDetail] = useState(null); // Sửa cú pháp useState
  const [sprintName, setSprintName] = useState("Sprint no.");
  const [sprintId, setSprintId] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${hours}:${minutes}-${day}/${month}/${year}`;
  };

  const handleMenuClick = (e) => {
    const selectedSprint = items.find((item) => item.key == e.key);
    if (selectedSprint) {
      setSprintName(selectedSprint.name);
      setCreatedAt(selectedSprint.created_at);
      setSprintId(e.key);
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const fetchSprints = async () => {
    try {
      const res = await api.get(`/room/view_sprint_by_room?room_id=${room_id}`);
      if (res.data && res.data.length > 0) {
        const _items = res.data.map((e) => ({
          label:
            e.sprint_name + " / Tạo vào lúc: " + formatDateTime(e.created_at),
          name: e.sprint_name,
          created_at: e.created_at,
          key: e.sprint_id,
          icon: <UserOutlined />,
        }));
        setCreatedAt(res.data[0].created_at);
        setSprintName(res.data[0].sprint_name);
        setSprintId(res.data[0].sprint_id);
        setItems(_items);
      } else {
        console.warn("No sprints found for this room.");
      }
    } catch (error) {
      console.error("Failed to fetch sprints:", error);
    }
  };

  const handleCreateSprint = async () => {
    try {
      await api.post(`/room/create_sprint?room_id=${room_id}`);
      fetchSprints(); // Refresh sprint list
    } catch (error) {
      console.error("Failed to create sprint:", error);
    }
  };

  const handleOk = async () => {
    await handleCreateSprint();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const fetchRole = async () => {
    try {
      const res = await api.get(
        `/room/view_role?user_id=${userId}&room_id=${room_id}`
      );
      setRoleDetail(res.data.role_detail);
    } catch (error) {
      console.error("Failed to fetch role:", error);
    }
  };

  useEffect(() => {
    fetchRole();
    fetchSprints();
  }, [room_id]);

  return (
    <>
      <div className="p-4">
        <Dropdown menu={menuProps}>
          <button className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
            <Space>
              {sprintName} / Tạo vào lúc:{" "}
              {createdAt ? formatDateTime(createdAt) : "N/A"}
              <DownOutlined />
            </Space>
          </button>
        </Dropdown>

        {/* Chỉ hiển thị nút tạo nếu roleDetail === 1 */}
        {roleDetail === 1 && (
          <>
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              onClick={() => setOpen(true)}
            >
              Tạo Sprint
            </button>

            <Modal
              title="Xác nhận"
              open={open}
              onCancel={handleCancel}
              footer={
                <button
                  onClick={handleOk}
                  className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                >
                  Xác nhận
                </button>
              }
            >
              <p>Bạn có chắc muốn tạo Sprint mới không?</p>
            </Modal>
          </>
        )}
      </div>

      {sprintId && <KanbanBoard params={params} sprintId={sprintId} />}
    </>
  );
}
