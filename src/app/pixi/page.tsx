"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { audioService } from "@/services/audioService";
import { localizationService } from "@/services/localizationService";
import { fetchPixiTaskTypes, fetchPixiTasks } from "@/services/pixiService";
import Preloader from "@/Components/Preloader";
import { prod } from "@/utils/prod"

const PixiPage = () => {
  const [taskTypes, setTaskTypes] = useState<PixiTaskType[]>([]);
  const [tasks, setTasks] = useState<PixiTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    audioService.playMusic(`${prod}/media/musics/where-is-the-cat.mp3`);
    return () => audioService.stopMusic();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const types = await fetchPixiTaskTypes();
        const allTasks = await fetchPixiTasks();
        setTaskTypes(types);
        setTasks(allTasks);
      } catch (error) {
        console.error("Ошибка загрузки Pixi данных:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <Preloader />;

  return (
    <div className="p-4">
      <div className="w-full flex justify-start p-2 sm:p-4">
        <Link
          href="/"
          className="text-base sm:text-lg text-white bg-green-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-500 transition"
        >
          {localizationService.get("home")}
        </Link>
      </div>
      <h1 className="text-xl font-bold mb-4">{localizationService.get("selectTask")}:</h1>

      {taskTypes.map(type => (
        <div key={type.id} className="mb-6">
          <h2 className="text-lg font-semibold capitalize">{localizationService.get(type.type)}</h2>
          <ul className="list-disc pl-5">
            {tasks
              .filter(task => task.type.id === type.id)
              .map(task => (
                <li key={task.id}>
                  <Link href={`/pixi/${task.slug}`} className="text-blue-500 hover:underline">
                    {task.title}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PixiPage;
