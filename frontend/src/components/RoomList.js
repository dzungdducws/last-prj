import React from "react";
import Link from "next/link";

function RoomList({ rooms }) {
  const displayedLabels = new Set(); // Bộ theo dõi trạng thái

  return (
    <nav className="flex-grow p-4">
      <ul className="space-y-2">
        {rooms.map((room) => {
          const shouldDisplayLabel = !displayedLabels.has(
            room.role_select_detail
          );
          if (shouldDisplayLabel) {
            displayedLabels.add(room.role_select_detail);
          }
          return (
            <React.Fragment key={room.role.room_id}>
              {/* Hiển thị nhãn khi lần đầu tiên thấy */}
              {shouldDisplayLabel && (
                <li className="text-sm font-semibold text-gray-500">
                  {room.role_select_detail === "owner" && "Owner"}
                  {room.role_select_detail === "member" && "Member"}
                </li>
              )}
              <li>
                <Link
                  href={"/dashboard/room-detail/" + room.role.room_id}
                  className="block p-2 rounded hover:bg-gray-700"
                >
                  {room.room_name}
                </Link>
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </nav>
  );
}

export default RoomList;
