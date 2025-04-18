import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/task`;


// Получение задачи по ID
export const fetchTaskById = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка при загрузке задачи (ID: ${id}):`, error);
    return null;
  }
};

// Получение списка всех задач
export const fetchTaskList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/list/`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке списка задач:", error);
    return null;
  }
};
