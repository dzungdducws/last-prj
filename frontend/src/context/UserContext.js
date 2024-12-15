import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/config/axiosConfig";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await api.get("/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserId(response.data.user_id);
          setUsername(response.data.username);
        }
      } catch (error) {
        console.error("Error fetching user ID: ", error);
      }
    };

    fetchUserId();
  }, []);

  return (
    <UserContext.Provider value={{ username, userId }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
