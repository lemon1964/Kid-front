"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchTaskList } from "@/services/taskService";
import Preloader from "@/Components/Preloader";
import { audioService } from "@/services/audioService";
import { prod } from "@/utils/prod"

export default function TaskListPage() {
  const [taskList, setTaskList] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    audioService.playMusic(`${prod}/media/musics/find-the-red-squares.mp3`);
    return () => {
      audioService.stopMusic();
    };
  }, []);

  useEffect(() => {
    fetchTaskList().then(data => {
      if (data) setTaskList(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Preloader />;
  if (!taskList) return <p>Failed to load task list.</p>;

  return (
    <div className="p-4">
      <div className="w-full flex justify-start p-2 sm:p-4">
        <Link
          href="/"
          className="text-base sm:text-lg text-white bg-green-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-500 transition"
        >
          To the main page
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Викторины */}
        <div>
          <h2 className="text-lg font-semibold">Quizzes</h2>
          <ul className="list-disc pl-5">
            {taskList.quizzes.map((quiz: any) => (
              <li key={quiz.unique_id}>
                <Link href={`/tasks/${quiz.unique_id}`} className="text-blue-500 hover:underline">
                  {quiz.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Drag & Drop */}
        <div>
          <h2 className="text-lg font-semibold">Drag & Drop</h2>
          <ul className="list-disc pl-5">
            {taskList.dragdrops.map((task: any) => (
              <li key={task.unique_id}>
                <Link href={`/tasks/${task.unique_id}`} className="text-green-500 hover:underline">
                  {task.description}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Pixi */}
        <div>
          <h2 className="text-lg font-semibold">Pixi</h2>
          <ul className="list-disc pl-5">
            {taskList.pixi_tasks.map((task: any) => (
              <li key={task.unique_id}>
                <Link href={`/tasks/${task.unique_id}`} className="text-orange-500 hover:underline">
                  {task.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
