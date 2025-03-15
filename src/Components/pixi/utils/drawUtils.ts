import { Graphics } from "pixi.js";
import { Color } from "pixi.js";

type DrawShapeOptions = {
  color: string; // Цвет заливки фигуры
  borderColor?: number; // Цвет рамки
  borderWidth?: number; // Толщина рамки
};

/**
 * Отрисовывает фигуру с заданными параметрами.
 * @param shape - объект Graphics для отрисовки.
 * @param obj - объект с параметрами фигуры.
 * @param options - параметры отрисовки.
 */
export const drawShapeWithBorder = (
  shape: Graphics,
  obj: { shape: string; color: string },
  options: DrawShapeOptions
): void => {
  const { color, borderColor = 0x000000, borderWidth = 0 } = options;

  shape.clear(); // Очищаем текущий рисунок
  shape.lineStyle(borderWidth, borderColor); // Устанавливаем рамку

  const fillColor = new Color(color).toNumber();
  shape.beginFill(fillColor);

  // Определяем фигуру
  if (obj.shape === "square") {
    shape.drawRect(0, 0, 100, 100);
  } else if (obj.shape === "circle") {
    shape.drawCircle(50, 50, 50);
  } else if (obj.shape === "triangle") {
    shape.drawPolygon([0, 100, 50, 0, 100, 100]);
  }

  shape.endFill();
};