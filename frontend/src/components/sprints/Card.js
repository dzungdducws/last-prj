"use client";

import api from "@/config/axiosConfig";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
export default function Card({ task, updateTaskType, doingBy }) {
  const [showPopup, setShowPopup] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [ws, setWs] = useState(null);
  const { username, userId } = useUser();

  useEffect(() => {
    if (showPopup) {
      const websocket = new WebSocket(
        `ws://localhost:8083/ws/cmt/${task.task_id}`
      );

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setComments((prevMessages) => [data, ...prevMessages]);
      };

      setWs(websocket);

      return () => {
        websocket.close();
      };
    }
  }, [showPopup, task.task_id]);

  const detail = [
    { id: 1, title: "Backlog" },
    { id: 2, title: "To-Do" },
    { id: 3, title: "In Progress" },
    { id: 4, title: "Testing" },
    { id: 5, title: "Review" },
    { id: 6, title: "Done" },
  ];

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${hours}:${minutes}-${day}/${month}/${year}`;
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/task/comments?task_id=${task.task_id}`);
      if (Array.isArray(res.data)) {
        setComments(res.data);
      } else {
        console.error("Comments data is not an array:", res.data);
        setComments([]);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setComments([]);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [task.task_id]);

  const addComment = () => {
    if (ws && newComment.trim()) {
      const message = JSON.stringify({
        message_detail: newComment,
        task_id: task.task_id,
        user_id: userId,
        username: username,
      });
      ws.send(message);
      setNewComment("");
    }
  };

  const comeBack = async () => {
    if (task.task_type > 0) {
      const newTaskType = task.task_type - 1;
      await api.post("/task/come_back", { task_id: task.task_id });
      updateTaskType(task.task_id, newTaskType);
    }
  };

  const moveForward = async () => {
    if (task.task_type < detail.length - 1) {
      const newTaskType = task.task_type + 1;
      await api.post("/task/move_forward", { task_id: task.task_id });
      updateTaskType(task.task_id, newTaskType);
    }
  };

  return (
    <>
      <div
        onClick={() => setShowPopup(true)}
        className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer border border-gray-200"
      >
        <h3 className="text-gray-900 font-semibold text-lg mb-2">
          {task.task_title}
        </h3>
        <p className="text-gray-600 text-xs mb-1">
          <span className="font-medium text-xs">Hạn:</span>{" "}
          {formatDateTime(task.due_date)}
        </p>
        <p className="text-gray-600 text-xs">
          <span className="font-medium text-xs">Ngày tạo:</span>{" "}
          {formatDateTime(task.created_at)}
        </p>
        <p className="text-gray-600 text-xs">Thực hiện bởi: {doingBy}</p>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-3/4 relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition"
            >
              ✖
            </button>
            <div className="flex h-full">
              <div className="w-1/2 h-full grid grid-cols-1 place-content-between">
                <div>
                  <h3 className="text-gray-900 font-semibold text-lg mb-4">
                    Chi tiết task
                  </h3>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Tiêu đề:</span>{" "}
                    {task.task_title}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Mô tả:</span>{" "}
                    {task.task_description}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Hạn:</span>{" "}
                    {formatDateTime(task.due_date)}
                  </p>
                  <p className="text-gray-600 mb-4">
                    <span className="font-medium">Ngày tạo:</span>{" "}
                    {formatDateTime(task.created_at)}
                  </p>
                </div>

                <div className="flex justify-between gap-4 h-fit">
                  {task.task_type > 0 && (
                    <button
                      onClick={comeBack}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Chuyển tới {detail[task.task_type - 1].title}
                    </button>
                  )}
                  {task.task_type < detail.length - 1 && (
                    <button
                      onClick={moveForward}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                      Chuyển tới {detail[task.task_type + 1].title}
                    </button>
                  )}
                </div>
              </div>

              <div className="ml-4 pl-4 border-l border-sky-500 w-1/2 h-full grid grid-cols-1 place-content-between">
                <h4 className="text-gray-800 font-semibold mb-2">Comments:</h4>
                <div className="grid grid-cols-1 overflow-y-auto scrollbar">
                  <div className="grid min-h-fit max-h-fi grid-cols-1 place-content-start p-4 gap-2 ">
                    {comments.map((comment) => (
                      <div
                        key={comment.comment_task_id}
                        className="bg-gray-100 p-3 rounded"
                      >
                        <p className="text-gray-800 text-sm">
                          {comment.username}
                          {": "}
                          {comment.message_detail}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {formatDateTime(comment.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-1/4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Thêm comment..."
                    className="w-full p-2 border rounded-md"
                    rows="3"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={addComment}
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition"
                    >
                      Thêm Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
