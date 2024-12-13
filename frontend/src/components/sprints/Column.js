"use client";

import React from "react";
import Card from "./Card";

export default function Column({ title, tasks }) {
  return (
    <div className="flex flex-col bg-gray-200 w-64 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <Card key={index} task={task} />
        ))}
      </div>
    </div>
  );
}
