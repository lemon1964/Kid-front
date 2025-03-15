"use client";

import React from "react";
import { useRef } from "react";
import Timer from "./Timer";
import MusicControl from "./MusicControl";
import Togglable from "@/Components/quizzes/Togglable";

interface NavbarProps {
  totalQuestions: number;
  completedQuestions: number;
  quizName: string;
  isQuizFinished: boolean;
  onTimeStop: (time: number) => void;
  correctAnswers: number;
  music: string;
}

const Navbar: React.FC<NavbarProps> = ({
  totalQuestions,
  completedQuestions,
  quizName,
  isQuizFinished,
  onTimeStop,
  correctAnswers,
  music,
}) => {
  const remainingQuestions = totalQuestions - completedQuestions;
  const blogFormRef = useRef();

  return (
    <div className="quiz-container bg-blue-500 p-4 text-white flex justify-between items-center">
      <Togglable buttonLabel="❌" ref={blogFormRef}>
        <h1 className="text-lg font-bold">{quizName}</h1>
        <div className="flex gap-4">
          <span className="text-blue-900 font-bold">Total: {totalQuestions}</span>
          <span className="text-green-400 font-bold">Passed: {completedQuestions}</span>
          <span className="text-purple-400 font-bold">Faithful: {correctAnswers}</span>
          <span className="text-orange-400 font-bold">Left: {remainingQuestions}</span>
        </div>
        <div className="flex gap-4 items-center">
          <Timer isQuizFinished={isQuizFinished} onTimeStop={onTimeStop} />
        </div>
        <div className="flex gap-4 items-center">
          <MusicControl music={music} />
        </div>
      </Togglable>
    </div>
  );
};

export default Navbar;
