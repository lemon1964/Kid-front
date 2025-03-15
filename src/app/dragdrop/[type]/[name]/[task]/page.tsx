"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ClientDragDropGame from "@Components/drag-drop/ClientDragDropGame";
import { fetchTaskBySlug } from "@/services/dragdropService";
import Preloader from "@/Components/Preloader";

export default function DragDropPage() {
  const { type, name, task } = useParams();
  const [taskData, setTaskData] = useState<TaskDataContinue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (name && task) {
      setLoading(true);
      fetchTaskBySlug(name as string, task as string)
        .then(data => {
          if (data) {
            setTaskData(data);
          } else {
            setError("Задача не найдена.");
          }
        })
        .catch(() => setError("Ошибка при загрузке задачи."))
        .finally(() => setLoading(false));
    }
  }, [name, task]);

  if (loading) return <Preloader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!taskData) return <p className="text-center text-gray-500">Задача не найдена.</p>;

  return <ClientDragDropGame taskData={taskData} />;
}
