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
  });

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
        <div className="flex flex-col space-y-4">
          <Input
            placeholder="Tên công việc"
            value={newTask.task_title}
            onChange={(e) =>
              setNewTask({ ...newTask, task_title: e.target.value })
            }
          />
          <TextArea
            rows={4}
            placeholder="Mô tả công việc"
            value={newTask.task_description}
            onChange={(e) =>
              setNewTask({ ...newTask, task_description: e.target.value })
            }
          />
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
