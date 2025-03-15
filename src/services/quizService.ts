import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quiz`;

// Получение списка всех викторин
export const fetchQuizzes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/list/`);
    return response.data.reverse(); // Обратный порядок, как в старом коде
  } catch (error) {
    console.error("Ошибка при загрузке викторин:", error);
    return [];
  }
};

// Получение викторины по slug
export const fetchQuizBySlug = async (slug: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/quizzes/?slug=${slug}`);
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error(`Ошибка при загрузке викторины (slug: ${slug}):`, error);
    return null;
  }
};
