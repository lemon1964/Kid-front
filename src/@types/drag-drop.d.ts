// 🔹 Общий тип изображения
interface ImageType {
  id: number;
  file: string;
  file_url: string;
  title: string;
}

// 🔹 Элементы Drag & Drop
interface Item {
  id: number;
  text: string;
  condition: string;
  image_url: ImageType;
  visibility_text: boolean;
  alt_text: string;
}

// 🔹 Контейнеры Drag & Drop
interface Container {
  id: number;
  title: string;
  condition: string;
  image_url: ImageType;
  visibility_text: boolean;
  alt_text: string;
  items: Item[];
}

// 🔹 Тип задачи (Рассели, Продолжи и т.д.)
interface DragDropName {
  id: number;
  name: string;
  slug: string;
  type: {
    id: number;
    type: string;
    slug: string;
  };
}

// 🔹 Задача Drag & Drop
interface TaskData {
  id: number;
  name: DragDropName; // ✅ Новая структура
  description: string;
  replacement: boolean;
  background_image: string;
  music: {
    id: number;
    title: string;
    file_url: string;
  };
  containers: Container[];
  items: Item[];
  slug: string;
  next_task: {
    id: number;
    name: string;
    slug: string;
    type: string;
  }[]; // ✅ Связанные задачи
}

// 🔹 Одинаковые типы для всех задач
type TaskDataContinue = TaskData;
