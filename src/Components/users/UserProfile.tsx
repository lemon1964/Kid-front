"use client";

import React, { useState, useEffect } from "react";
import apiClient from "@/services/authClientService";

const UserProfile: React.FC = () => {
  const [points, setPoints] = useState(0);

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await apiClient.get(`${baseURL}/api/auth/user/`);
        setPoints(response.data.points);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchPoints();
  }, [baseURL]);

  return (
    <div className="profile-page p-8">
      <h1 className="text-2xl font-bold">Your profile</h1>
      <p className="text-lg mt-2">Your current points: <strong>{points}</strong></p>
    </div>
  );
};

export default UserProfile;
