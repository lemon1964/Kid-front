import React, { ReactNode } from "react";
import { formatFileUrl } from "@/utils/formatFileUrl";
import { localizationService } from "@/services/localizationService";

type GameLayoutProps = {
  title: string; // Заголовок игры
  objectCount: number; // Количество объектов
  setObjectCount: (count: number) => void; // Функция изменения количества объектов
  resetGame: () => void; // Функция для сброса игры
  canvasRef: React.RefObject<HTMLDivElement>; // Ссылка на Canvas
  attempts: number; // Количество попыток
  result: string; // Сообщение о текущей попытке
  correctMessage: string; // Сообщение о завершении игры
  onStart: () => void; // Функция для старта игры
  pageBackground: string;
  children?: ReactNode; // Дополнительные элементы
};

const GameLayout: React.FC<GameLayoutProps> = ({
  title,
  objectCount,
  setObjectCount,
  resetGame,
  canvasRef,
  attempts,
  result,
  correctMessage,
  onStart,
  pageBackground,
  children,
}) => {
  return (
    <div 
      className="p-4 w-full"
      style={{
        backgroundImage: pageBackground ? `url(${formatFileUrl(pageBackground)})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mb-4">
        <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded shadow-md" onClick={onStart}>
          {localizationService.get("Start")}
        </button>
        
        <h2 className="text-lg font-bold text-white drop-shadow-md bg-black/40 px-2 py-1 rounded-md inline-block">
          {title}
        </h2>
  
        <div className="mb-2 text-white text-lg font-semibold drop-shadow-md">
          {localizationService.get("NumberOfObjects")}
          <input
            type="number"
            min="2"
            max="8"
            value={objectCount}
            onChange={e => setObjectCount(Math.min(8, Math.max(2, Number(e.target.value))))}
            className="ml-2 p-1 border border-gray-500 text-black text-lg font-semibold rounded bg-white shadow-md"
          />
        </div>
  
        <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded shadow-md" onClick={resetGame}>
          {localizationService.get("StartOver")}
        </button>
      </div>
  
      <div ref={canvasRef} className="border-2 border-gray-300"/>
  
      <div className="mt-4 text-white text-lg font-semibold drop-shadow-md">
        <p>
          {localizationService.get("NumberOfAttempts")}: {attempts}
        </p>
        <p>
          {localizationService.get("Attempt")}: {result}
        </p>
        <p>
          {localizationService.get("Result")}: {correctMessage}
        </p>
      </div>
  
      {children}
    </div>
  );
  
};

export default GameLayout;
