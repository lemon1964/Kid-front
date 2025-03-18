"use client";

import { useEffect, useRef, useState } from "react";
import { Graphics } from "pixi.js";
import { createObjectLayout } from "@/Components/pixi/utils/objectLayout";
import { audioService } from "@/services/audioService";
import {
  GlowAnimation,
  startShakeAnimation,
  DimensionalAnimation,
} from "@/Components/pixi/utils/animations";
import { drawShapeWithBorder } from "@/Components/pixi/utils/drawUtils";
import GameLayout from "@/Components/pixi/GameLayout";

interface GeometryProps {
  task: PixiTask;
}

const Geometry: React.FC<GeometryProps> = ({ task }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState("");
  const [objectCount, setObjectCount] = useState(4);
  const [correctClicks, setCorrectClicks] = useState<Set<number>>(new Set());
  const [objects, setObjects] = useState<PixiObject[]>([]);

  useEffect(() => {
    const normalizedObjects = task.objects.slice(0, objectCount);
    setObjects(normalizedObjects);
  }, [task, objectCount]);

  useEffect(() => {
    if (task.music) {
      audioService.playMusic(task.music.file_url);
    }
    return () => {
      audioService.stopMusic();
    };
  }, [task.music]);

  useEffect(() => {
    const pixi_background = task.pixi_background;
    const app = createObjectLayout(canvasRef, objects, handleClick, pixi_background);
    return () => {
      app.destroy(true, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objects, task.pixi_background]);

  useEffect(() => {
    const correctCount = objects.filter(obj => obj.is_correct).length;
    if (correctClicks.size === correctCount && correctCount > 0) {
      setTimeout(() => {
        audioService.playSoundEffect("taskCompleted");
      }, 1000);
    }
  }, [correctClicks, objects]);

  const handleClick = (obj: PixiObject, shape: Graphics) => {
    const isCorrect = obj.is_correct;
    setAttempts(prev => prev + 1);

    audioService.playSoundEffect(isCorrect ? "correct" : "incorrect");
    setResult(isCorrect ? "✅ Correct!" : "❌ Incorrect!");

    drawShapeWithBorder(shape, obj, {
      color: obj.color,
      borderColor: isCorrect ? 0x00ff00 : 0xff0000,
      borderWidth: 5,
    });

    shape.eventMode = "none";

    if (isCorrect) {
      setCorrectClicks(prev => new Set(prev).add(obj.id));
    }

    // ✅ Вызываем нужную анимацию
    switch (task.animation) {
      case "glow":
        GlowAnimation(shape);
        break;
      case "shake":
        startShakeAnimation(shape);
        break;
      case "scale":
        DimensionalAnimation(shape);
        break;
      default:
        console.warn("⚠️ Неизвестная анимация:", task.animation);
    }
  };

  const resetGame = () => {
    setAttempts(0);
    setResult("");
    setCorrectClicks(new Set());
    setObjects(task.objects.slice(0, objectCount));
    audioService.speak(task.title);
  };

  const handleStart = () => {
    audioService.playSoundEffect("correct");
    audioService.speak(task.title);
  };

  const correctMessage =
    correctClicks.size === objects.filter(obj => obj.is_correct).length
      ? "🎉 All correct objects have been selected!"
      : "";

  return (
    <GameLayout
      pageBackground={task.page_background}
      title={task.title}
      objectCount={objectCount}
      setObjectCount={setObjectCount}
      resetGame={resetGame}
      canvasRef={canvasRef}
      attempts={attempts}
      result={result}
      correctMessage={correctMessage}
      onStart={handleStart}
    ></GameLayout>
  );
};

export default Geometry;
