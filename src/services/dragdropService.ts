import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dragdrop`;
// const BASE_URL = "http://127.0.0.1:8000/api/dragdrop";

// Получить все задачи Drag & Drop
export const fetchDragDropTasks = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tasks/`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке задач:", error);
    return [];
  }
};

// Получить конкретную задачу по slug
export const fetchDragDropTaskBySlug = async (slug: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/tasks/?slug=${slug}`);
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error(`Ошибка при загрузке задачи (slug: ${slug}):`, error);
    return null;
  }
};

// Получить все типы Drag & Drop
export const fetchDragDropTypes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/types/`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке типов задач:", error);
    return [];
  }
};


// ✅ Получить конкретную задачу из группы
export const fetchTaskBySlug = async (nameSlug: string, taskSlug: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/tasks/?slug=${nameSlug}&task_slug=${taskSlug}`);
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error(`Ошибка при загрузке задачи (name: ${nameSlug}, task: ${taskSlug}):`, error);
    return null;
  }
};
