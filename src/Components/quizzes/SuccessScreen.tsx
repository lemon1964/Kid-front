"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getSession } from "next-auth/react";
import apiClient from "@/services/authClientService";

interface SuccessScreenProps {
  totalQuestions: number;
  correctAnswers: number;
  pointsEarned: number;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({
  totalQuestions,
  correctAnswers,
  pointsEarned,
}) => {
  const [userName, setUserName] = useState<string>("");
  const [totalPoints, setTotalPoints] = useState<number>(0);

  const updatePointsAndFetchUserData = useCallback(
    async (abortSignal: AbortSignal) => {
      try {
        const freshSession = await getSession();
        if (!freshSession?.backendToken) {
          console.log("No auth token found in session");
          return;
        }

        if (pointsEarned > 0) {
          await apiClient.post(
            "/api/auth/update-points/",
            { points: pointsEarned },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${freshSession.backendToken}`,
              },
              signal: abortSignal,
            }
          );
          console.log("Points updated successfully");
        }

        const response = await apiClient.get("/api/auth/get-user-data/", {
          headers: {
            Authorization: `Bearer ${freshSession.backendToken}`,
          },
          signal: abortSignal,
        });

        setUserName(response.data.name);
        setTotalPoints(response.data.points);
      } 
      catch (error: unknown) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            console.log("Request aborted");
          } else {
            console.log("Failed to update points and fetch user data:", error);
          }
        } else {
          console.log("An unexpected error occurred", error);
        }
      }
    },
    [pointsEarned]
  );

  useEffect(() => {
    const controller = new AbortController();
    updatePointsAndFetchUserData(controller.signal);

    return () => controller.abort();
  }, [updatePointsAndFetchUserData]);

  return (
    <div className="success-screen bg-green-800 text-100 p-8 rounded shadow-md">
      <h1 className="text-2xl font-bold text-blue-200">Congratulations!</h1>
      <p className="text-lg mt-2">
        You have completed the quiz! Total questions: <strong>{totalQuestions}</strong>, correct
        answers: <strong>{correctAnswers}</strong>.
      </p>
      <p className="text-lg mt-2">
        Points earned: <strong>{pointsEarned}</strong>
      </p>
      <p className="text-lg mt-2">
        {userName}, now you have a total of <strong>{totalPoints}</strong> points!
      </p>
    </div>
  );
};

export default SuccessScreen;
