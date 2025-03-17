"use client";

import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { audioService } from "@/services/audioService";
import {
  GlowAnimationImage,
  DimensionalAnimationImage,
  startShakeAnimationImage,
} from "@/Components/pixi/utils/animations";
import GameLayout from "@/Components/pixi/GameLayout";
import { createImageLayout } from "@/Components/pixi/utils/createImageLayout";

interface ImageProps {
  task: PixiTask;
}

const Image: React.FC<ImageProps> = ({ task }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const pixiAppRef = useRef<PIXI.Application | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState("");
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
  const [objectCount, setObjectCount] = useState(8);
  const [correctClicks, setCorrectClicks] = useState<Set<number>>(new Set());
  const [images, setImages] = useState<PixiImageType[]>([]);

  useEffect(() => {
    setImages(task.pixi_images.slice(0, objectCount));
  }, [task, objectCount]);

  useEffect(() => {
    audioService.speak(task.title);
    if (task.music) {
      audioService.playMusic(task.music.file_url);
    }
    return () => {
      audioService.stopMusic();
    };
  }, []);

  useEffect(() => {
    const correctCount = images.filter(img => img.is_correct).length;
    if (correctClicks.size === correctCount && correctCount > 0) {
      setTimeout(() => {
        audioService.playSoundEffect("taskCompleted");
      }, 1000);
    }
  }, [correctClicks, images]);

  useEffect(() => {
    if (!canvasRef.current || !images.length) return;

    const pixi_background = task.pixi_background
    const cleanup = createImageLayout(canvasRef, images, selectedImages, handleClick, pixiAppRef, pixi_background);
    return cleanup; // ✅ Очистка Pixi при уходе со страницы
  }, [images]);

  const handleClick = (img: PixiImageType, sprite: PIXI.Sprite, border: PIXI.Graphics) => {
    setAttempts(prev => prev + 1);
    if (selectedImages.has(img.id)) return;
    setSelectedImages(prev => new Set(prev).add(img.id));

    audioService.playSoundEffect(img.is_correct ? "correct" : "incorrect");
    setResult(img.is_correct ? "✅ Correct!" : "❌ Incorrect!");

    border.clear();
    border.lineStyle(6, img.is_correct ? 0x00ff00 : 0xff0000);
    border.drawRect(-sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);

    if (img.is_correct) {
      setCorrectClicks(prev => new Set(prev).add(img.id));
    }

    switch (task.animation) {
      case "glow":
        GlowAnimationImage(sprite);
        break;
      case "scale":
        DimensionalAnimationImage(sprite);
        break;
      case "shake":
        startShakeAnimationImage(sprite);
        break;
    }
  };

  const resetGame = () => {
    setAttempts(0);
    setResult("");
    setCorrectClicks(new Set());
    setSelectedImages(new Set());
    setImages(task.pixi_images.slice(0, objectCount));
  };

  const handleStart = () => {
    audioService.playSoundEffect("correct");
    audioService.speak(task.title);
  };

  const correctMessage =
    correctClicks.size === images.filter(img => img.is_correct).length
      ? "🎉 Все выбрано верно!"
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
    />
  );
};

export default Image;
