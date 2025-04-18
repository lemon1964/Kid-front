import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pixi`;

// Получение списка типов задач
export const fetchPixiTaskTypes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/task-types/`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке типов задач Pixi:", error);
    return [];
  }
};

// Получение списка всех задач
export const fetchPixiTasks = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tasks/`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке задач Pixi:", error);
    return [];
  }
};

// Получение задачи по slug
export const fetchPixiTaskBySlug = async (slug: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/tasks/?slug=${slug}`);
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error(`Ошибка при загрузке задачи (slug: ${slug}):`, error);
    return null;
  }
};


