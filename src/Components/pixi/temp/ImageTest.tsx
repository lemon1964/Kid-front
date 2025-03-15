"use client";

import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { formatFileUrl } from "@/utils/formatFileUrl";

interface ImageProps {
  task: PixiTask;
}

const ImageTest: React.FC<ImageProps> = ({ task }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const pixiAppRef = useRef<PIXI.Application | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());

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
    const bgTexture = PIXI.Texture.from("/media/images/backgrounds/wood-texture.jpg");
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

    task.pixi_images.forEach((img, index) => {
      const texture = PIXI.Texture.from(formatFileUrl(img.image_url));

      // ✅ Дожидаемся загрузки текстуры, чтобы избежать цветного канваса
      texture.baseTexture.on("loaded", () => {
        const sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5);

        // ✅ Масштабируем пропорционально
        const maxSize = Math.min(cellWidth, cellHeight) - padding * 2;
        const scaleFactor = maxSize / Math.max(sprite.width, sprite.height);
        sprite.scale.set(scaleFactor);

        // 📍 Вычисляем позицию в сетке
        const col = index % columns;
        const row = Math.floor(index / columns);
        sprite.x = col * cellWidth + cellWidth / 2;
        sprite.y = row * cellHeight + cellHeight / 2;

        // ✅ Рамка (создаём после загрузки и масштабирования)
        const border = new PIXI.Graphics();
        border.lineStyle(6, 0xffffff);
        border.drawRect(-sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
        border.x = sprite.x;
        border.y = sprite.y; // ✅ Фикс положения рамки

        sprite.eventMode = "static";
        sprite.cursor = "pointer";

        sprite.on("pointerdown", () => {
          if (selectedImages.has(img.id)) return;
          handleClick(img, sprite, border);
          sprite.eventMode = "none";

          // ✅ Обновляем цвет рамки
          border.clear();
          border.lineStyle(6, img.is_correct ? 0x00ff00 : 0xff0000);
          border.drawRect(-sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
        });

        stage.addChild(border);
        stage.addChild(sprite);
      });
    });

    return () => {
      console.log("🗑 Очищаем сцену перед размонтированием");
      if (pixiAppRef.current) {
        pixiAppRef.current.destroy(true, { children: true, texture: true, baseTexture: true });
        pixiAppRef.current = null;
      }
    };
  }, [task]); // ✅ Следим за `task`

  const handleClick = (img: PixiImageType, sprite: PIXI.Sprite, border: PIXI.Graphics) => {
    if (selectedImages.has(img.id)) return;
    setSelectedImages((prev) => new Set(prev).add(img.id));

    // ✅ Обновляем рамку
    border.clear();
    border.lineStyle(6, img.is_correct ? 0x00ff00 : 0xff0000);
    border.drawRect(-sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/media/images/backgrounds/sky.jpg')", // ✅ Фон всей страницы
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        ref={canvasRef}
        className="border-2 border-gray-300 w-full max-w-[800px] mx-auto"
      />
    </div>
  );
};

export default ImageTest;
