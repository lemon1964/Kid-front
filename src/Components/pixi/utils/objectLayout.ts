import * as PIXI from "pixi.js";
import { Application, Graphics } from "pixi.js";
import { drawShape } from "./drawShape";
import { formatFileUrl } from "@/utils/formatFileUrl";

export const createObjectLayout = (
  canvasRef: React.RefObject<HTMLDivElement>,
  objects: PixiObject[],
  handleClick: (obj: PixiObject, shape: Graphics, app: Application) => void,
  pixi_background: string
) => {
  const app = new Application({
    width: 800,
    height: 500,
    backgroundColor: 0xffffff, // ✅ Белый фон
  });

  (app.view as HTMLCanvasElement).style.width = "100%";

  const stage = app.stage;
    // ✅ Фон 
  const bgTexture = PIXI.Texture.from(formatFileUrl(pixi_background));
  const background = new PIXI.Sprite(bgTexture);
  background.width = app.view.width;
  background.height = app.view.height;
  stage.addChild(background);

  if (canvasRef.current) {
    canvasRef.current.appendChild(app.view as HTMLCanvasElement);

    const columns = 4; // 4 объекта в ряду
    const rows = 2; // 2 ряда
    const cellWidth = app.view.width / columns;
    const cellHeight = app.view.height / rows;

    objects.forEach((obj, index) => {
      const shape = new Graphics();

      // // Рисуем форму с помощью утилиты
      drawShape(shape, obj);

      // Вычисляем позицию объекта в сетке
      const col = index % columns;
      const row = Math.floor(index / columns);

      // Рандомное смещение внутри своей ячейки
      const randomOffsetX = Math.random() * (cellWidth - 100);
      const randomOffsetY = Math.random() * (cellHeight - 100);

      shape.x = col * cellWidth + randomOffsetX;
      shape.y = row * cellHeight + randomOffsetY;

      shape.eventMode = "static";

      shape.on("pointerdown", () => handleClick(obj, shape, app));
      app.stage.addChild(shape);
    });
  }

  return app;
};
