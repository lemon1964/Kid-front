"use client";

import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { audioService } from "@/services/audioService";
import { formatFileUrl } from "@/utils/formatFileUrl";

interface ColoringProps {
  task: PixiTask;
}

const Coloring: React.FC<ColoringProps> = ({ task }) => {
  const [selectedColor, setSelectedColor] = useState<number>(0xff0000);
  const [shapesGraphics, setShapesGraphics] = useState<Record<string, PIXI.Graphics>>({});
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (task.music) {
      audioService.playMusic(task.music.file_url);
    }
    return () => audioService.stopMusic();
  }, [task.music]);

  useEffect(() => {
    if (!canvasRef.current || task.svg_images.length === 0) return;

    const app = new PIXI.Application({ width: 500, height: 500, backgroundColor: 0xffffff });
    (app.view as HTMLCanvasElement).style.display = "block"; // ✅ Убираем отступы
    (app.view as HTMLCanvasElement).style.margin = "0 auto"; // ✅ Центрируем
    appRef.current = app;
    canvasRef.current.appendChild(app.view as unknown as Node);

    // ✅ Фон
    const stage = app.stage;
    const bgTexture = PIXI.Texture.from(formatFileUrl(task.pixi_background));
    const background = new PIXI.Sprite(bgTexture);
    background.width = app.view.width;
    background.height = app.view.height;
    background.anchor.set(0.5); // ✅ Центрируем фон, если он не заполняет весь канвас
    background.x = app.view.width / 2;
    background.y = app.view.height / 2;

    stage.addChild(background);

    const svgUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${task.svg_images[0].file_url}`;
    fetch(svgUrl)
      .then(response => response.text())
      .then(svgText => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const elements = Array.from(svgDoc.querySelectorAll("rect, circle, polygon"));

        const offsetX = 250;
        const offsetY = 250;
        const defaultColor = 0xffffff;

        const graphicsMap: Record<string, PIXI.Graphics> = {}; // ✅ Храним ссылки на фигуры

        elements.forEach(element => {
          const graphic = new PIXI.Graphics();
          const shapeId = element.id || `shape-${Math.random()}`;

          if (element.tagName === "rect") {
            const x = parseFloat(element.getAttribute("x") || "0") + offsetX;
            const y = parseFloat(element.getAttribute("y") || "0") + offsetY;
            const width = parseFloat(element.getAttribute("width") || "0");
            const height = parseFloat(element.getAttribute("height") || "0");
            graphic.lineStyle(2, 0x000000);
            graphic.beginFill(defaultColor);
            graphic.drawRect(x, y, width, height);
            graphic.endFill();
          } else if (element.tagName === "circle") {
            const cx = parseFloat(element.getAttribute("cx") || "0") + offsetX;
            const cy = parseFloat(element.getAttribute("cy") || "0") + offsetY;
            const r = parseFloat(element.getAttribute("r") || "0");
            graphic.lineStyle(2, 0x000000);
            graphic.beginFill(defaultColor);
            graphic.drawCircle(cx, cy, r);
            graphic.endFill();
          } else if (element.tagName === "polygon") {
            const points = element
              .getAttribute("points")
              ?.split(" ")
              .map(pair => pair.split(",").map(Number))
              .map(([x, y]) => [x + offsetX, y + offsetY])
              .flat();
            if (points) {
              graphic.lineStyle(2, 0x000000);
              graphic.beginFill(defaultColor);
              graphic.drawPolygon(points);
              graphic.endFill();
            }
          }

          graphic.eventMode = "dynamic";
          graphic.cursor = "pointer";
          graphicsMap[shapeId] = graphic;
          app.stage.addChild(graphic);
        });

        setShapesGraphics(graphicsMap);
      });

    return () => appRef.current?.destroy(true, { children: true });
  }, [task.svg_images]);

  // ✅ Обновляем цвета без ререндера
  useEffect(() => {
    Object.values(shapesGraphics).forEach(graphic => {
      graphic.eventMode = "dynamic";
      graphic.cursor = "pointer";
      graphic.removeAllListeners("pointerdown");
      graphic.on("pointerdown", () => {
        graphic.tint = selectedColor;
      });
    });
  }, [selectedColor, shapesGraphics]);

  return (
    <div
      className="p-4 w-full flex flex-col items-center justify-center"
      style={{
        backgroundImage: task.page_background
          ? `url(${formatFileUrl(task.page_background)})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="text-xl font-bold">{task.title}</h2>
      <p className="text-gray-500">{task.description}</p>
      <div className="relative mt-4">
        <div
          ref={canvasRef}
          className="border-4 border-gray-500 shadow-lg rounded-lg"
          style={{ width: "auto", display: "block", margin: "0 auto" }} // 🟢 Центрируем canvas
        />
      </div>
      {/* Кнопки выбора цвета */}
      <div className="flex gap-2 mt-4">
        {["#ff0000", "#0000ff", "#ffff00", "#00ff00"].map(color => (
          <button
            key={color}
            onClick={() => setSelectedColor(parseInt(color.replace("#", "0x")))}
            style={{
              backgroundColor: color,
              color: color === "#ffff00" ? "#000" : "#fff",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
            }}
            className="rounded shadow-md transition-transform transform hover:scale-110"
          />
        ))}
      </div>
    </div>
  );
};

export default Coloring;
