"use client";

import api from "@/config/axiosConfig";
import React, { useEffect, useState } from "react";
import Column from "./Column";

export default function KanbanTable({ params, sprintId }) {
  const [columns, setColumns] = useState([
    { id: 1, title: "Backlog", tasks: [] },
    { id: 2, title: "To-Do", tasks: [] },
    { id: 3, title: "In Progress", tasks: [] },
    { id: 4, title: "Testing", tasks: [] },
    { id: 5, title: "Review", tasks: [] },
    { id: 6, title: "Done", tasks: [] },
  ]);

  useEffect(() => {
    const getTask = async () => {
      const res = await api.get(
        `/room/view_task_by_sprint?sprint_id=${sprintId}`
      );
      const updatedColumns = columns.map((column) => {
        const filteredTasks = res.data.filter(
          (e) => e.task.task_type === column.id - 1
        );
        return { ...column, tasks: filteredTasks };
      });
      setColumns(updatedColumns);
    };
    getTask();
  }, [sprintId]);

  const updateTaskType = async (taskId, newTaskType) => {
    const newColumns = [...columns];

    for (let column of newColumns) {
      const taskIndex = column.tasks.findIndex(
        (task) => task.task.task_id === taskId
      );
      if (taskIndex !== -1) {
        const [task] = column.tasks.splice(taskIndex, 1);
        task.task.task_type = newTaskType;
        const targetColumn = newColumns.find(
          (col) => col.id === newTaskType + 1
        );
        if (targetColumn) {
          targetColumn.tasks.push(task);
        }
        break;
      }
    }

    setColumns(newColumns);
  };

  return (
    <div className="flex space-x-4 overflow-y-auto p-4">
      {columns.map((column) => (
        <Column
          key={column.id}
          title={column.title}
          tasks={column.tasks}
          updateTaskType={updateTaskType}
        />
      ))}
    </div>
  );
}
