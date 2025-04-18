
"use client";

import React, { useState, useEffect } from "react";

interface TimerProps {
  isQuizFinished: boolean;
  onTimeStop: (time: number) => void; // Коллбек для передачи времени
}

const Timer: React.FC<TimerProps> = ({ isQuizFinished, onTimeStop }) => {
  const [time, setTime] = useState(0); // Секунды
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning]);

  // Останавливаем таймер, если викторина завершена
  useEffect(() => {
    if (isQuizFinished) {
      setIsRunning(false);
      onTimeStop(time); // Передаем итоговое время
    }
  }, [isQuizFinished, onTimeStop, time]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setIsRunning((prev) => !prev)}
        disabled={isQuizFinished}
        className={`bg-blue-700 text-white px-3 py-1 rounded ${
          isQuizFinished ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isRunning ? "Pause" : "Timer"}
      </button>
      <span className="text-lg font-bold">{formatTime(time)}</span>
    </div>
  );
};

export default Timer;

