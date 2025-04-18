import { Graphics, Color } from "pixi.js";

/**
 * Рисует форму на графическом объекте Pixi.js
 * @param shape - Графический объект Pixi.js
 * @param obj - Объект с типом ObjectType, содержащий данные о цвете и форме
 * @param isCorrect - Указывает, является ли объект правильным (добавляет рамку)
 */
export const drawShape = (
  shape: Graphics,
  obj: ObjectType,
  isCorrect: boolean = false
): void => {
  // Очищаем текущую фигуру
  shape.clear();

  // Устанавливаем цвет рамки, если isCorrect
  if (isCorrect) {
    const borderColor = isCorrect ? 0x00ff00 : 0xff0000; // Зеленый или красный цвет
    shape.lineStyle(5, borderColor);
  }

  // Задаем основной цвет заливки
  const color = new Color(obj.color).toNumber();
  shape.beginFill(color);

  // Рисуем соответствующую форму
  if (obj.shape === "square") {
    shape.drawRect(0, 0, 100, 100);
  } else if (obj.shape === "circle") {
    shape.drawCircle(50, 50, 50);
  } else if (obj.shape === "triangle") {
    shape.drawPolygon([0, 100, 50, 0, 100, 100]);
  }

  shape.endFill();
};