"use client";

import api from "@/config/axiosConfig";
import React, { useEffect, useState } from "react";
import Column from "./Column";

export default function KanbanTable({ params, sprintId }) {
  const [columns, setColumns] = useState([
    { id: 1, title: "Backlog", tasks: ["Task 1", "Task 2"] },
    { id: 2, title: "To-Do", tasks: ["Task 3"] },
    { id: 3, title: "In Progress", tasks: ["Task 4"] },
    { id: 4, title: "Testing", tasks: ["Task 4"] },
    { id: 5, title: "Review", tasks: ["Task 4"] },
    { id: 6, title: "Done", tasks: [] },
  ]);

  return (
    <div className="flex space-x-4 overflow-y-auto p-4">
      {columns.map((column) => (
        <Column key={column.id} title={column.title} tasks={column.tasks} />
      ))}
    </div>
  );
}
