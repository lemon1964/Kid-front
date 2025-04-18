"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Preloader from "@/Components/Preloader";
import { fetchTaskById } from "@/services/taskService";
import ClientDragDropGame from "@Components/drag-drop/ClientDragDropGame";
import Quiz from "@Components/quizzes/Quiz";
import ClientPixiGame from "@Components/pixi/ClientPixiGame";

export default function TaskPage() {
  const { id } = useParams();
  const [taskData, setTaskData] = useState<TaskDataTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchTaskById(id as string)
        .then(data => {
          if (data) {
            setTaskData(data);
          } else {
            setError("Task not found.");
          }
        })
        .catch(() => setError("Error loading task."))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <Preloader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!taskData) return <p className="text-center text-gray-500">Task not found.</p>;

  return (

    <div>
      {taskData.type === "dragdrop" && (
        <ClientDragDropGame taskData={taskData.data as TaskData} />
      )}
      {taskData.type === "quiz" && (
        <Quiz quizData={taskData.data as QuizDataType} />
      )}
      {taskData.type === "pixi" && (
        <ClientPixiGame task={taskData.data as PixiTask} />
      )}
    </div>
  );
}
