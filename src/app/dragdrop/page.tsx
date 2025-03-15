"use client";

import { useEffect, useState } from "react";
import { localizationService } from "@/services/localizationService";
import Link from "next/link";
import { audioService } from "@/services/audioService";
import { fetchDragDropTaskBySlug } from "@/services/dragdropService";
import { prod } from "@/utils/prod"

const DragDropPage = () => {
  const [taskGroups, setTaskGroups] = useState<Record<string, string | null>>({});

  useEffect(() => {
    audioService.playMusic(`${prod}/media/musics/tasks.mp3`);
    return () => {
      audioService.stopMusic();
    };
  }, []);

  useEffect(() => {
    const fetchFirstTasks = async () => {
      const groups = ["resettle", "place", "continue", "fill", "replace", "fill_replace"];
      const groupTasks: Record<string, string | null> = {};

      for (const group of groups) {
        const tasks = await fetchDragDropTaskBySlug(group);
        groupTasks[group] = tasks ? tasks.name.slug : null;
      }
      setTaskGroups(groupTasks);
    };

    fetchFirstTasks();
  }, []);

  return (
    <div className="p-6">
      <div className="w-full flex justify-start p-2 sm:p-4">
        <Link
          href="/"
          className="text-base sm:text-lg text-white bg-green-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-500 transition"
        >
          {localizationService.get("home")}
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Select Drag & Drop task</h1>

      {/* Блок: Распределение объектов */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Distribution of objects</h2>
        <ul className="list-disc list-inside space-y-2">
          {taskGroups["resettle"] && (
            <li>
              <Link
                href={`/dragdrop/classification/resettle/${taskGroups["resettle"]}`}
                className="text-blue-600 hover:underline"
              >
                Guess the place
              </Link>
            </li>
          )}
          {taskGroups["place"] && (
            <li>
              <Link
                href={`/dragdrop/classification/place/${taskGroups["place"]}`}
                className="text-blue-600 hover:underline"
              >
                Put it in its place
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Блок: Продолжение последовательности */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Sequences of objects</h2>
        <ul className="list-disc list-inside space-y-2">
          {taskGroups["continue"] && (
            <li>
              <Link
                href={`/dragdrop/sequence-completion/continue/${taskGroups["continue"]}`}
                className="text-blue-600 hover:underline"
              >
                Continue the series
              </Link>
            </li>
          )}
          {taskGroups["fill"] && (
            <li>
              <Link
                href={`/dragdrop/sequence-completion/fill/${taskGroups["fill"]}`}
                className="text-blue-600 hover:underline"
              >
                Fill in the blanks
              </Link>
            </li>
          )}
          {taskGroups["replace"] && (
            <li>
              <Link
                href={`/dragdrop/sequence-completion/replace/${taskGroups["replace"]}`}
                className="text-blue-600 hover:underline"
              >
                Replace with correct ones
              </Link>
            </li>
          )}
          {taskGroups["fill_replace"] && (
            <li>
              <Link
                href={`/dragdrop/sequence-completion/fill_replace/${taskGroups["fill_replace"]}`}
                className="text-blue-600 hover:underline"
              >
                Fill in the blanks and replace with correct ones
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DragDropPage;
