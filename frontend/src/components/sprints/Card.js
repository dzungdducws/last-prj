"use client";

export default function Card({ task }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:bg-gray-50 cursor-pointer">
      <p className="text-gray-800">{task}</p>
    </div>
  );
}
