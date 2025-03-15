import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import Preloader from "@/Components/Preloader";
import QuizQuestion from "./QuizQuestion";
import FinalScreen from "./FinalScreen";
import { formatFileUrl } from "@/utils/formatFileUrl";
import { audioService } from "@/services/audioService";

type QuizProps = {
  quizData: QuizDataType;
};

const Quiz = ({ quizData }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [hasSpoken, setHasSpoken] = useState(false); // Флаг для отслеживания, был ли уже вызван speak

  useEffect(() => {
    if (!hasSpoken) {
      audioService.speak(quizData.description);
      setHasSpoken(true);
    }
  }, [quizData.description, hasSpoken]);

  const averageTimePerQuestion = quizData.average_time_per_question;
  const totalQuestions = quizData.questions.length;
  const timePerQuestion = correctAnswers > 0 ? totalTime / correctAnswers : 0;

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setIsQuizFinished(true);
      audioService.speak("Oh yes!");
    }
  };

  // Правильный ответ
  const handleCorrectAnswer = () => {
    setCorrectAnswers(prev => prev + 1);
  };

  // Остановка времени
  const handleTimeStop = (time: number) => {
    setTotalTime(time);
  };

  const questionComponents = [
    ...quizData.questions.map((question, index) => (
      <QuizQuestion
        key={index}
        quizData={question}
        onNext={handleNext}
        onCorrectAnswer={handleCorrectAnswer}
      />
    )),
    <FinalScreen
      totalQuestions={totalQuestions}
      correctAnswers={correctAnswers}
      questions={quizData.questions}
      nextQuizzes={quizData.next_quizzes || []}
      averageTimePerQuestion={averageTimePerQuestion}
      timePerQuestion={timePerQuestion}
      totalTime={totalTime}
    />,
  ];
  
  return (
    <div 
      className="p-4 w-full"
      style={{
        backgroundImage: quizData.page_background ? `url(${formatFileUrl(quizData.page_background)})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full flex justify-start p-2 sm:p-4">
        <Link href="/quizzes" className="text-base sm:text-lg text-white bg-green-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-500 transition">
        To the list of quizzes
        </Link>
      </div>
      <div className="quiz-content">
        {quizData ? (
          <div>
            <Navbar
              totalQuestions={totalQuestions}
              completedQuestions={currentQuestion}
              quizName={quizData.title}
              isQuizFinished={isQuizFinished}
              onTimeStop={handleTimeStop}
              correctAnswers={correctAnswers}
              music={quizData.music?.file_url || ""}
            />
            {questionComponents[currentQuestion]}
          </div>
        ) : (
          <Preloader />
        )}
      </div>
    </div>
  );
};

export default Quiz;
