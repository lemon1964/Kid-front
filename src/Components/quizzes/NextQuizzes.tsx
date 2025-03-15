"use client";

import React from "react";
import Link from "next/link";

interface NextQuizzesProps {
  nextQuizzes: { title: string; slug: string }[];
}

const NextQuizzes: React.FC<NextQuizzesProps> = ({ nextQuizzes }) => {
  return (
    <div className="next-quizzes mt-6">
      <h2 className="text-xl font-bold">Next quizzes:</h2>
      <ul className="list-disc pl-6 mt-2">
        {nextQuizzes.reverse().map((quiz, index) => (
          <li key={index}>
            <Link
              href={`/quizzes/${quiz.slug}`}
              className="text-blue-700 font-semibold hover:underline"
            >
              {quiz.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NextQuizzes;
