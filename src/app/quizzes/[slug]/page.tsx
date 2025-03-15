"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchQuizBySlug } from "@/services/quizService";
import Preloader from "@/Components/Preloader";
import Quiz from "@/Components/quizzes/Quiz";

const QuizPage = () => {
  const { slug } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    fetchQuizBySlug(slug as string)
      .then((data) => {
        if (data) setQuizData(data);
        else setError("Викторина не найдена.");
      })
      .catch(() => setError("Ошибка загрузки данных викторины."))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Preloader />;
  if (error) return <div>{error}</div>;
  if (!quizData) return <div>Нет данных для отображения.</div>;

  return (
    <div className="p-4">
      <Quiz quizData={quizData} />
    </div>
  );
};

export default QuizPage;
