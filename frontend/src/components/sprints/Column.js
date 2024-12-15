"use client";

import React from "react";
import Card from "./Card";

export default function Column({ title, tasks, updateTaskType }) {
  return (
    <div className="flex flex-col bg-gray-200 w-64 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
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
