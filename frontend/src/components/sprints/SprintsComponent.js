"use client";

import api from "@/config/axiosConfig";
import React, { useEffect, useState } from "react";
import KanbanBoard from "./KanbanBoard";
export default function SprintsComponent({ params }) {
  const room_id = params.room_id;

  return (
    <>
      <KanbanBoard params={params} sprintId={1} />
    </>
  );
}
