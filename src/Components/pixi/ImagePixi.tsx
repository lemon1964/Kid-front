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
import { formatFileUrl } from "@/utils/formatFileUrl";

interface ImageProps {
  task: PixiTask;
}

interface PixiAppCanvas extends HTMLCanvasElement {
  __pixiApp?: PIXI.Application;
}

const ImagePixi: React.FC<ImageProps> = ({ task }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const pixiAppRef = useRef<PIXI.Application | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState("");
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
  const [objectCount, setObjectCount] = useState(4);
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
  }, [task.music, task.title]);

  useEffect(() => {
    const correctCount = images.filter(img => img.is_correct).length;
    if (correctClicks.size === correctCount && correctCount > 0) {
      setTimeout(() => {
        audioService.playSoundEffect("taskCompleted");
      }, 1000);
    }
  }, [correctClicks, images]);

  useEffect(() => {
    if (!canvasRef.current || !task.pixi_images.length) return; // ⛔ Ждём загрузки картинок

    // ✅ Удаляем старый Pixi.Application перед созданием нового
    if (pixiAppRef.current) {
      pixiAppRef.current.destroy(true, { children: true, texture: true, baseTexture: true });
      pixiAppRef.current = null;
    }

    // ✅ Создаём Pixi-приложение
    pixiAppRef.current = new PIXI.Application({
      width: 800,
      height: 500,
      backgroundColor: 0xffffff, // ✅ Белый фон
    });

    (pixiAppRef.current.view as HTMLCanvasElement).style.width = "100%";
    canvasRef.current.appendChild(pixiAppRef.current.view as unknown as Node);

    const app = pixiAppRef.current;
    const stage = app.stage;

    // ✅ Фоновая картинка
    const bgTexture = PIXI.Texture.from(formatFileUrl(task.pixi_background));
    const background = new PIXI.Sprite(bgTexture);
    background.width = app.view.width;
    background.height = app.view.height;
    stage.addChild(background);

    // ✅ Загружаем картинки
    const columns = Math.ceil(Math.sqrt(task.pixi_images.length));
    const rows = Math.ceil(task.pixi_images.length / columns);
    const cellWidth = app.view.width / columns;
    const cellHeight = app.view.height / rows;
    const padding = 10;

    images.forEach((img, index) => {
      const texture = PIXI.Texture.from(formatFileUrl(img.image_url));

      const addSpriteToStage = () => {
        const sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5);

        const maxSize = Math.min(cellWidth, cellHeight) - padding * 2;
        const scaleFactor = maxSize / Math.max(sprite.width, sprite.height);
        sprite.scale.set(scaleFactor);

        const col = index % columns;
        const row = Math.floor(index / columns);
        sprite.x = col * cellWidth + cellWidth / 2;
        sprite.y = row * cellHeight + cellHeight / 2;

        const border = new PIXI.Graphics();
        border.lineStyle(6, 0xffffff);
        border.drawRect(-sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
        border.x = sprite.x;
        border.y = sprite.y;

        sprite.eventMode = "static";
        sprite.cursor = "pointer";

        sprite.on("pointerdown", () => {
          if (selectedImages.has(img.id)) return;
          handleClick(img, sprite, border);
          sprite.eventMode = "none";

          border.clear();
          border.lineStyle(6, img.is_correct ? 0x00ff00 : 0xff0000);
          border.drawRect(-sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
        });

        stage.addChild(border);
        stage.addChild(sprite);
      };

      // 🧠 Проверяем, загружена ли текстура
      if (texture.baseTexture.valid) {
        addSpriteToStage();
      } else {
        texture.baseTexture.once("loaded", addSpriteToStage);
      }

      // // ✅ Дожидаемся загрузки текстуры, чтобы избежать цветного канваса
      // texture.baseTexture.on("loaded", () => {
      //   const sprite = new PIXI.Sprite(texture);
      //   sprite.anchor.set(0.5);

      //   // ✅ Масштабируем пропорционально
      //   const maxSize = Math.min(cellWidth, cellHeight) - padding * 2;
      //   const scaleFactor = maxSize / Math.max(sprite.width, sprite.height);
      //   sprite.scale.set(scaleFactor);

      //   // 📍 Вычисляем позицию в сетке
      //   const col = index % columns;
      //   const row = Math.floor(index / columns);
      //   sprite.x = col * cellWidth + cellWidth / 2;
      //   sprite.y = row * cellHeight + cellHeight / 2;

      //   // ✅ Рамка (создаём после загрузки и масштабирования)
      //   const border = new PIXI.Graphics();
      //   border.lineStyle(6, 0xffffff);
      //   border.drawRect(-sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
      //   border.x = sprite.x;
      //   border.y = sprite.y; // ✅ Фикс положения рамки

      //   sprite.eventMode = "static";
      //   sprite.cursor = "pointer";

      //   sprite.on("pointerdown", () => {
      //     if (selectedImages.has(img.id)) return;
      //     handleClick(img, sprite, border);
      //     sprite.eventMode = "none";

      //     // ✅ Обновляем цвет рамки
      //     border.clear();
      //     border.lineStyle(6, img.is_correct ? 0x00ff00 : 0xff0000);
      //     border.drawRect(-sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
      //   });

      //   stage.addChild(border);
      //   stage.addChild(sprite);
      // });
    });

    return () => {
      // console.log("🗑 Очищаем сцену перед размонтированием");
      if (pixiAppRef.current) {
        pixiAppRef.current.destroy(true, { children: true, texture: true, baseTexture: true });
        pixiAppRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // 🧹 Полностью удаляем содержимое canvasRef
    if (canvasRef.current) {
      canvasRef.current.innerHTML = "";
    }

    // ⏳ Делаем задержку перед установкой новых изображений
    setTimeout(() => {
      setImages(task.pixi_images.slice(0, objectCount));
      audioService.speak(task.title);
    }, 50);
  };

  // const resetGame = () => {
  //   setAttempts(0);
  //   setResult("");
  //   setCorrectClicks(new Set());
  //   setSelectedImages(new Set()); // ✅ Очистка выбранных картинок

  //   // ✅ Очищаем сцену Pixi.js
  //   if (canvasRef.current) {
  //     const canvas = canvasRef.current.children[0] as HTMLCanvasElement | undefined;
  //     if (canvas) {
  //       const app = (canvas as PixiAppCanvas).__pixiApp;
  //       if (app) {
  //         app.stage.removeChildren();
  //       }
  //     }
  //   }

  //   // ✅ Перерисовываем заново
  //   setImages(task.pixi_images.slice(0, objectCount));
  //   audioService.speak(task.title);
  // };

  const handleStart = () => {
    audioService.playSoundEffect("correct");
    audioService.speak(task.title);
  };

  const correctMessage =
    correctClicks.size === images.filter(img => img.is_correct).length
      ? "🎉 Everything is chosen correctly!"
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

export default ImagePixi;
