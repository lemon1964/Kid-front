import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "./Container";
import ItemList from "./ItemList";
import { useDispatch } from "react-redux";
import { showNotification } from "@/reducers/notificationReducer";
import { AppDispatch } from "@/store/store";
import Notification from "@Components/Notification";
import { formatFileUrl } from "@/utils/formatFileUrl";
import { audioService } from "@/services/audioService";
import { localizationService } from "@/services/localizationService";

interface DragDropProps {
  taskData: TaskDataContinue;
}

export default function DragDrop2({ taskData }: DragDropProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [containers, setContainers] = useState<Container[]>(
    taskData.containers.map(container => ({
      ...container,
      image: container.image_url?.file_url,
    }))
  );

  const [items, setItems] = useState<Item[]>(
    taskData.items.map(item => ({
      ...item,
      image: item.image_url.file_url,
    }))
  );

  useEffect(() => {
    audioService.playMusic(taskData.music.file_url);
    audioService.speak(localizationService.get("LetsGo"));
    return () => {
      audioService.stopMusic();
    };
  }, []);

  const handleDrop = (item: Item, targetContainer: Container) => {
    if (
      !targetContainer ||
      (!taskData.replacement && targetContainer.image_url?.file_url) ||
      targetContainer.condition !== item.condition
    ) {
      dispatch(showNotification("Oops, try again...", "error", 1));
      return;
    }

    dispatch(showNotification("Absolutely right!", "success", 1));

    setContainers(prev =>
      prev.map(container =>
        container.id === targetContainer.id
          ? { ...container, image_url: item.image_url }
          : container
      )
    );

    setItems(prev => prev.filter(i => i.id !== item.id));
  };

  const handleNextTask = () => {
    if (taskData.next_task.length > 0) {
      const nextTask = taskData.next_task[0];
      router.replace(`/dragdrop/${nextTask.type}/${nextTask.name}/${nextTask.slug}`);
    }
  };

  return (
    <div
      className="game-container flex flex-col items-center p-4 bg-blue-100 min-h-screen"
      style={{
        backgroundImage: `url(${formatFileUrl(taskData.background_image)})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Notification />

      <div className="w-full flex justify-start p-2 sm:p-4">
        <Link
          href="/dragdrop"
          className="text-base sm:text-lg text-white bg-green-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-500 transition"
        >
          To the tasks
        </Link>
      </div>

      {/* Заголовок */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-white drop-shadow-md">
        {taskData.description}
      </h1>

      {/* Контейнеры */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 border-4 border-blue-400 rounded-lg shadow-lg bg-yellow-100">
        {containers.map(container => (
          <Container key={container.id} container={container} onDrop={handleDrop} />
        ))}
      </div>

      {/* Список предметов */}
      <ItemList items={items} />
      {/* ✅ Кнопка "Следующая задача" */}
      {taskData.next_task.length > 0 && (
        <button
          onClick={handleNextTask}
          className="mt-6 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Next task →
        </button>
      )}
    </div>
  );
}
