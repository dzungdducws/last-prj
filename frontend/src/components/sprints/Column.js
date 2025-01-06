"use client";

import React, { useState } from "react";
import Card from "./Card";
import { Modal, Input, Select } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function Column({
  id,
  title,
  tasks,
  updateTaskType,
  roleDetail,
  addBackLogTask,
}) {
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    task_title: "",
    task_description: "",
    due_date: "",
    reward_points: "",
    assignee: "",
  });

  const members = [
    { id: 1, name: "Nguyễn Văn A" },
    { id: 2, name: "Trần Thị B" },
    { id: 3, name: "Lê Văn C" },
  ];

  const handleOk = async () => {
    if (!newTask.task_title) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    addBackLogTask(newTask);
    setNewTask({ task_title: "", task_description: "" }); // Reset form
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    setNewTask({ task_title: "", task_description: "" });
  };

  return (
    <div className="flex flex-col bg-gray-200 w-64 p-4 rounded-lg shadow">
      <div className="flex mb-2 pb-2 border-b border-sky-500 justify-between">
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        {roleDetail === 1 && id === 1 && (
          <PlusCircleOutlined
            className="text-blue-500 cursor-pointer"
            onClick={() => setOpen(true)}
          />
        )}
      </div>

      <Modal
        title="Thêm công việc mới"
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
        <div>
          <label
            htmlFor="task-title"
            className="block text-sm font-medium text-gray-700"
          >
            Tên công việc
          </label>
          <Input
            id="task-title"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="Nhập tên công việc..."
            value={newTask.task_title}
            onChange={(e) =>
              setNewTask({ ...newTask, task_title: e.target.value })
            }
          />
        </div>

        {/* TextArea: Nhập mô tả công việc */}
        <div>
          <label
            htmlFor="task-description"
            className="block text-sm font-medium text-gray-700"
          >
            Mô tả công việc
          </label>
          <TextArea
            id="task-description"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="Nhập mô tả công việc..."
            value={newTask.task_description}
            onChange={(e) =>
              setNewTask({ ...newTask, task_description: e.target.value })
            }
          />
        </div>

        {/* Ngày hết hạn */}
        <div>
          <label
            htmlFor="due-date"
            className="block text-sm font-medium text-gray-700"
          >
            Ngày hết hạn
          </label>
          <Input
            id="due-date"
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            value={newTask.due_date}
            onChange={(e) =>
              setNewTask({ ...newTask, due_date: e.target.value })
            }
          />
        </div>

        {/* Điểm thưởng */}
        <div>
          <label
            htmlFor="reward-points"
            className="block text-sm font-medium text-gray-700"
          >
            Điểm thưởng
          </label>
          <Input
            id="reward-points"
            type="number"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="Nhập điểm thưởng..."
            value={newTask.reward_points}
            onChange={(e) =>
              setNewTask({ ...newTask, reward_points: e.target.value })
            }
          />
        </div>

        {/* Người được bàn giao */}
        <div>
          <label
            htmlFor="assignee"
            className="block text-sm font-medium text-gray-700"
          >
            Người được bàn giao
          </label>
          <select
            id="assignee"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            value={newTask.assignee}
            onChange={(e) =>
              setNewTask({ ...newTask, assignee: e.target.value })
            }
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

      <div className="space-y-4 overflow-y-auto overflow-x-hidden scrollbar">
        {tasks.map((task) => (
          <Card
            key={task.task.task_id}
            task={task.task}
            doingBy={task.username}
            updateTaskType={updateTaskType}
          />
        ))}
      </div>
    </div>
  );
}
