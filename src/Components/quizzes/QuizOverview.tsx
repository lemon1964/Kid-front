"use client";

import React, { useState } from "react";
import { formatFileUrl } from "@/utils/formatFileUrl";
import Image from 'next/image';

interface QuizOverviewProps {
  questions: QuizQuestionType[];
}

const QuizOverview: React.FC<QuizOverviewProps> = ({ questions }) => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const toggleQuestion = (id: number) => {
    setExpandedQuestion((prev) => (prev === id ? null : id));
  };

  return (
    <div className="quiz-overview">
      <h2 className="text-xl font-bold mb-4">Quiz Overview</h2>
      <ul className="list-none">
        {questions.map((question) => (
          <li key={question.id} className="mb-4">
            <button
              onClick={() => toggleQuestion(question.id)}
              className="text-blue-500 font-semibold"
            >
              {question.text}
            </button>
            {expandedQuestion === question.id && (
              <div className="mt-2">
                {question.answers.map((answer) => (
                  <div
                    key={answer.id}
                    className="flex items-center gap-4 p-2 rounded"
                  >
                    {answer.image_url && (
                      <Image
                        src={formatFileUrl(answer.image_url.file_url)}
                        alt={answer.image_url.title || "Answer image"}
                        width={50}
                        height={50}
                        className={`answer-image ${
                          answer.is_correct
                            ? "border-green-500"
                            : "border-red-500 opacity-70"
                        }`}
                      />
                    )}
                    <span>{answer.text}</span>
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      <style jsx global>{`
        .answer-image {
          object-fit: cover;
          border: 3px solid; /* Border thickness */
          border-radius: 5px; /* Rounded corners */
        }
        .border-green-500 {
          border-color: #22c55e; /* Green */
        }
        .border-red-500 {
          border-color: #ef4444; /* Red */
        }
        .opacity-70 {
          opacity: 0.7; /* Semi-transparency */
        }
      `}</style>
    </div>
  );
};

export default QuizOverview;

