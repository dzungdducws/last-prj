import React from "react";
import Link from "next/link";

function RoomList({ rooms }) {
  const displayedLabels = new Set(); // Bộ theo dõi trạng thái
  const renderTitle = (type) => {
    switch (type) {
      case 1:
        return "Admin";
      case 2:
        return "Member";
      case 3:
        return "Tester";
      default:
        return "<DefaultComponent />";
    }
  };
  return (
    <nav className="flex-grow p-4">
      <ul className="space-y-2">
        {rooms.map((room) => {
          const shouldDisplayLabel = !displayedLabels.has(room.role_select_id);
          if (shouldDisplayLabel) {
            displayedLabels.add(room.role_select_id);
          }
          return (
            <React.Fragment key={room.role.room_id}>
              {shouldDisplayLabel && (
                <li className="text-sm font-semibold text-gray-500">
                  {renderTitle(room.role_select_id)}
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
