import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "./Container";
import ItemList from "./ItemList";
import { useDispatch } from "react-redux";
import { showNotification } from "@/reducers/notificationReducer";
import { AppDispatch } from "@/store/store";
import Notification from "@/Components/Notification";
import { formatFileUrl } from "@/utils/formatFileUrl";
import { audioService } from "@/services/audioService";
import { localizationService } from "@/services/localizationService";

interface DragDropProps {
  taskData: TaskData;
}

const DragDrop: React.FC<DragDropProps> = ({ taskData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [containers, setContainers] = useState<Container[]>(
    taskData.containers.map(container => ({
      ...container,
      items: [],
    }))
  );

  const [unassignedItems, setUnassignedItems] = useState<Item[]>(
    taskData.items.map(item => ({
      ...item,
      image: formatFileUrl(item.image_url?.file_url),
    }))
  );

  useEffect(() => {
    audioService.playMusic(taskData.music.file_url);
    audioService.speak(localizationService.get("LetsGo"));
    return () => {
      audioService.stopMusic();
    };
  }, [taskData.music.file_url]);

  const moveItemToContainer = (itemId: number, containerId: number) => {
    const draggedItem = unassignedItems.find(item => item.id === itemId);
    const targetContainerIndex = containers.findIndex(container => container.id === containerId);

    if (!draggedItem || targetContainerIndex === -1) return;

    if (draggedItem.condition !== containers[targetContainerIndex].condition) {
      dispatch(showNotification("Oops, try again...", "error", 1));
      return;
    }

    dispatch(showNotification("Absolutely right!", "success", 1));

    setUnassignedItems(prevItems => prevItems.filter(item => item.id !== itemId));

    // ✅ Обновляем только один контейнер, не все
    setContainers(prevContainers =>
      prevContainers.map((container, index) =>
        index === targetContainerIndex
          ? { ...container, items: [...container.items, draggedItem] }
          : container
      )
    );
  };

  const handleNextTask = () => {
    if (taskData.next_task.length > 0) {
      const nextTask = taskData.next_task[0];
      router.replace(`/dragdrop/${nextTask.type}/${nextTask.name}/${nextTask.slug}`);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center px-2 sm:px-4"
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

      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-white drop-shadow-md">
        {taskData.description}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-5xl">
        {containers.map((container, index) => (
          <Container
            key={container.id}
            container={container}
            moveItemToContainer={moveItemToContainer}
            index={index}
          />
        ))}
      </div>
      <ItemList items={unassignedItems} />
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
};

export default DragDrop;
