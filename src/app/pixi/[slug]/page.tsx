"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchPixiTaskBySlug } from "@/services/pixiService";
import Link from "next/link";
import { localizationService } from "@/services/localizationService";
import ClientPixiGame from "@/Components/pixi/ClientPixiGame";
import Preloader from "@/Components/Preloader";

export default function PixiTaskPage() {
  const { slug } = useParams();
  const [task, setTask] = useState<PixiTask | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetchPixiTaskBySlug(slug as string)
      .then((data) => {
        if (data) setTask(data);
      })
      .catch(() => console.error("Ошибка загрузки задачи"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Preloader />;
  if (!task) return <p>Task not found</p>;

  return (
    <div className="p-4">
      <div className="w-full flex justify-start p-2 sm:p-4">
        <Link href="/pixi" className="text-base sm:text-lg text-white bg-green-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-500 transition">
          {localizationService.get("ToThePixiTasks")}
        </Link>
      </div>

      <ClientPixiGame task={task} />
    </div>
  );
}

