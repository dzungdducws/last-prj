"use client";

export default async function RoomDetailPage({ params }) {
  const room_id = (await params).room_id;
  console.log(params);
  

  return (
    <div className="p-4 m-64"> 
      <h1 className="text-2xl font-bold">Room Detail</h1>
      <p>Room ID: {room_id}</p>
    </div>
  );
}
