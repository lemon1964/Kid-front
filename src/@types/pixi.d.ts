// 🔹 Общий тип изображения (SVG или PNG/JPG)
interface PixiImageType {
    id: number;
    title: string;
    file_url: string;
    is_correct: boolean;
    image_url: string;
  }
  
  // 🔹 Объекты Pixi (геометрические фигуры)
  interface PixiObject {
    id: number;
    color: string;
    shape: string;
    is_correct: boolean;
  }
  
  // 🔹 Тип задачи Pixi (Геометрия, Изображения, Раскраски)
  interface PixiTaskType {
    id: number;
    type: string;
    slug: string;
  }
  
  // 🔹 Музыка для задачи
  interface PixiMusic {
    id: number;
    title: string;
    file_url: string;
  }
  
  // 🔹 Задача Pixi
  interface PixiTask {
    id: number;
    title: string;
    description: string;
    task_mode: "find" | "select"; // ✅ Два режима задачи
    slug: string;
    type: PixiTaskType;
    objects: PixiObject[];
    svg_images: PixiImageType[]; // ✅ SVG-файлы
    pixi_images: PixiImageType[]; // ✅ JPG/PNG файлы
    music: PixiMusic | null; // ✅ Опциональная музыка
    animation: "glow" | "shake" | "scale";
    page_background: string;
    pixi_background: string;
  }
  