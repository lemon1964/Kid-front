"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Preloader from "@/Components/Preloader";
// import { QuizQuestionType } from "@/types";
import { audioService } from "@/services/audioService";
import { formatFileUrl } from "@/utils/formatFileUrl";

type QuizQuestionProps = {
  quizData: QuizQuestionType;
  onNext: () => void;
  onCorrectAnswer: () => void;
};

export default function QuizQuestion({ quizData, onNext, onCorrectAnswer }: QuizQuestionProps) {
  const [correctClicks, setCorrectClicks] = useState<Set<number>>(new Set());
  const [clickedImages, setClickedImages] = useState<Set<number>>(new Set());
  const [imageStyles, setImageStyles] = useState<Record<number, string>>({});

  // if (!quizData) return <Preloader />;

  const { answers, visibility_text, text } = quizData;
  const correctAnswersCount = answers.filter(item => item.is_correct).length;

  useEffect(() => {
    setCorrectClicks(new Set());
    setClickedImages(new Set());
    setImageStyles({});
  }, [quizData]);

  useEffect(() => {
    // Убедитесь, что логика с задержкой и вызовом playSoundEffect всегда вызывается, но только когда это нужно.
    if (correctClicks.size === correctAnswersCount && correctAnswersCount > 0) {
      const timeout = setTimeout(() => {
        audioService.playSoundEffect("taskCompleted");
        onCorrectAnswer();
        onNext();
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [correctClicks, correctAnswersCount, onCorrectAnswer, onNext]);

  if (!quizData) return <Preloader />;

  const handleSelect = (itemId: number | undefined) => {
    if (itemId === undefined || clickedImages.has(itemId)) return;

    const selected = answers.find(item => item.id === itemId);
    if (selected) {
      setClickedImages(prev => new Set(prev).add(itemId));

      if (selected.is_correct) {
        audioService.playSoundEffect("correct");
        setCorrectClicks(prev => {
          const updatedSet = new Set(prev);
          updatedSet.add(itemId);
          return updatedSet;
        });

        setImageStyles(prev => ({
          ...prev,
          [itemId]: "border-green-500",
        }));
      } else {
        audioService.playSoundEffect("incorrect");
        setImageStyles(prev => ({
          ...prev,
          [itemId]: "border-red-500",
        }));
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">{text}</h1>
      <div className="wrapper">
        {answers.map(item => (
          <div
            key={item.id}
            className={`answer-item border-2 rounded-lg ${
              imageStyles[item.id] || "border-transparent"
            }`}
          >
            <button
              onClick={() => handleSelect(item.id)}
              className={`p-2 hover:shadow-lg ${
                clickedImages.has(item.id) ? "pointer-events-none" : ""
              }`}
            >
              <Image
                src={formatFileUrl(item.image_url.file_url)}
                alt={item.text}
                width={200}
                height={180}
              />
            </button>
            {visibility_text && (
              <button
                onClick={() => handleSelect(item.id)}
                className="mt-2 text-center text-gray-700 font-medium hover:underline"
              >
                {item.text}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={onNext}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Next question
        </button>
      </div>
    </div>
  );
}
