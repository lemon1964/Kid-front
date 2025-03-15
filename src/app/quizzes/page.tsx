"use client";

import { useEffect, useState } from "react";
import { fetchQuizzes } from "@/services/quizService";
import Link from "next/link";
import { localizationService } from "@/services/localizationService";
import { audioService } from "@/services/audioService";
import Preloader from "@/Components/Preloader";
import { prod } from "@/utils/prod"

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizDataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    audioService.playMusic(`${prod}/media/musics/quizzes.mp3`);
    return () => audioService.stopMusic();
  }, []);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const data = await fetchQuizzes();
        setQuizzes(data);
      } catch (error) {
        console.error("Ошибка загрузки викторин:", error);
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, []);

  if (loading) return <Preloader />;

  return (
    <div className="p-4">
      <div className="w-full flex justify-start p-2 sm:p-4">
        <Link
          href="/"
          className="text-base sm:text-lg text-white bg-green-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-500 transition"
        >
          {localizationService.get("home")}
        </Link>
      </div>
      <h1 className="text-xl font-bold mb-4">{localizationService.get("SelectQuiz")}:</h1>
      <ul className="list-disc pl-5">
        {quizzes.map(quiz => (
          <li key={quiz.slug}>
            <Link href={`/quizzes/${quiz.slug}`} className="text-blue-500 hover:underline">
              {quiz.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

