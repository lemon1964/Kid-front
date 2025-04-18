import React, { useState, useEffect } from "react";
import SuccessScreen from "./SuccessScreen";
import QuizOverview from "./QuizOverview";
import ShareButton from "./ShareButton";
import { calculatePoints } from "./utils";
import NextQuizzes from "./NextQuizzes";

interface FinalScreenProps {
  totalQuestions: number;
  correctAnswers: number;
  timePerQuestion: number;
  questions: QuizQuestionType[];
  nextQuizzes: { id: number; title: string; slug: string }[];
  averageTimePerQuestion: number;
  totalTime: number;
}

const FinalScreen: React.FC<FinalScreenProps> = ({
  totalQuestions,
  correctAnswers,
  timePerQuestion,
  questions,
  nextQuizzes,
  averageTimePerQuestion,
  totalTime,
}) => {
  const [pointsEarned, setPointsEarned] = useState<number | null>(null);

  useEffect(() => {
    const finalPoints = calculatePoints(
      totalQuestions,
      correctAnswers,
      averageTimePerQuestion,
      timePerQuestion
    );

    const timeoutId = setTimeout(() => {
      setPointsEarned(finalPoints);
    }, 500);

    return () => clearTimeout(timeoutId); // Очищаем таймер при размонтировании
  }, [totalTime, correctAnswers, averageTimePerQuestion, timePerQuestion, totalQuestions]);

  return (
    <div>
      <SuccessScreen
        totalQuestions={totalQuestions}
        correctAnswers={correctAnswers}
        pointsEarned={pointsEarned ?? 0}
      />
      <QuizOverview questions={questions} />
      <ShareButton />
      <NextQuizzes nextQuizzes={nextQuizzes} />
    </div>
  );
};

export default FinalScreen;
