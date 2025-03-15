import { Graphics } from "pixi.js";
import { gsap } from "gsap";
import PIXI from "pixi.js";

// Функция для анимации тряски
export const startShakeAnimation = (shape: Graphics): void => {
  gsap
    .timeline()
    .to(shape, { duration: 0.1, x: shape.x - 20, ease: "power1.inOut" })
    .to(shape, { duration: 0.1, x: shape.x + 20, ease: "power1.inOut" })
    .to(shape, { duration: 0.1, x: shape.x, ease: "power1.inOut" })
    .repeat(3); // Повторяем цикл 3 раза
};

// Функция для анимации масштабирования
export const DimensionalAnimation = (shape: Graphics): void => {
  // Устанавливаем pivot (точку привязки) в центр графического объекта
  shape.pivot.set(shape.width / 2, shape.height / 2);

  // Устанавливаем позицию так, чтобы объект остался на том же месте
  shape.x += shape.width / 2;
  shape.y += shape.height / 2;

  // Запускаем анимацию
  gsap.to(shape.scale, {
    x: 1.5,
    y: 1.5,
    duration: 0.3,
    yoyo: true,
    repeat: 3,
    ease: "power1.inOut",
  });
};

// Функция для анимации свечения и вращения
export const GlowAnimation = (shape: Graphics): void => {
  // Смещение от центра: 1/10 размера фигуры
  const offsetX = shape.width / 15;
  const offsetY = shape.height / 15;

  // Сохраняем текущие координаты
  const initialX = shape.x;
  const initialY = shape.y;

  // Устанавливаем pivot с небольшим смещением от центра
  shape.pivot.set(shape.width / 2 + offsetX, shape.height / 2 + offsetY);

  // Корректируем позицию, чтобы фигура осталась на месте
  shape.x = initialX + shape.pivot.x;
  shape.y = initialY + shape.pivot.y;

  // Создаем анимацию вращения и изменения прозрачности
  gsap.timeline()
    .to(shape, {
      rotation: Math.PI, // Вращение на 180 градусов
      duration: 1,
      ease: "power2.inOut",
    })
    .to(shape, {
      alpha: 0.25, // Уменьшение прозрачности
      duration: 0.25,
      yoyo: true,
      repeat: 1, // Возврат к исходной прозрачности
      ease: "sine.inOut",
    }, "<") // Запускаем одновременно с вращением
    .to(shape, {
      rotation: Math.PI * 2, // Завершаем полный оборот (360 градусов)
      duration: 0.5,
      ease: "power2.inOut",
    });
};


// 🔥 Эффекты для Image
// 🔥 PIXI Glow
export const GlowAnimationImage = (sprite: PIXI.Sprite) => {
  gsap.to(sprite, { alpha: 0.5, duration: 0.3, yoyo: true, repeat: 3 });
};

// 📏 PIXI Scale
export const DimensionalAnimationImage = (sprite: PIXI.Sprite) => {
  gsap.to(sprite.scale, { x: 1.5, y: 1.5, duration: 0.3, yoyo: true, repeat: 1 });
};

// 🔄 PIXI Shake
export const startShakeAnimationImage = (sprite: PIXI.Sprite) => {
  gsap.to(sprite, { x: sprite.x - 10, duration: 0.1, yoyo: true, repeat: 5 });
};

