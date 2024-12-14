"use client";

import api from "@/config/axiosConfig";
import React, { useEffect, useState } from "react";

import KanbanBoard from "./KanbanBoard";

import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space } from "antd";

export default function SprintsComponent({ params }) {
  const room_id = params.room_id;
  const [sprintName, setSprintName] = useState("Sprint no.");
  const [sprintId, setSprintId] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [items, setItems] = useState([]);

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

  const handleMenuClick = (e) => {
    console.log(items);

    const selectedSprint = items.find((item) => item.key == e.key);
    console.log(selectedSprint);

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

  useEffect(() => {
    const getSprint = async () => {
      try {
        const res = await api.get(
          `/room/view_sprint_by_room?room_id=${room_id}`
        );
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
    getSprint();
  }, [room_id]);

  return (
    <>
      <Dropdown menu={menuProps}>
        <Button>
          <Space>
            {sprintName} / Tạo vào lúc: {formatDateTime(createdAt)}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
      {sprintId && <KanbanBoard params={params} sprintId={sprintId} />}
    </>
  );
}
