import * as PIXI from "pixi.js";
import { formatFileUrl } from "@/utils/formatFileUrl";

export const createImageLayout = (
  canvasRef: React.RefObject<HTMLDivElement>,
  images: PixiImageType[],
  selectedImages: Set<number>,
  handleClick: (img: PixiImageType, sprite: PIXI.Sprite, border: PIXI.Graphics) => void,
  pixiAppRef: React.MutableRefObject<PIXI.Application | null>,
  pixi_background: string
) => {
  if (!canvasRef.current || !images.length) return;

  // ✅ Очистка старой сцены перед созданием новой
  if (pixiAppRef.current) {
    pixiAppRef.current.destroy(true, { children: true, texture: true, baseTexture: true });
    pixiAppRef.current = null;
  }

  // ✅ Создаём новый Pixi.Application
  pixiAppRef.current = new PIXI.Application({
    width: 800,
    height: 500,
    backgroundColor: 0xffffff,
  });

  (pixiAppRef.current.view as HTMLCanvasElement).style.width = "100%";
  canvasRef.current.appendChild(pixiAppRef.current.view as unknown as Node);

  const app = pixiAppRef.current;
  const stage = app.stage;

  // ✅ Фон 
  const bgTexture = PIXI.Texture.from(formatFileUrl(pixi_background));
  const background = new PIXI.Sprite(bgTexture);
  background.width = app.view.width;
  background.height = app.view.height;
  stage.addChild(background);

  // ✅ Загружаем картинки
  const columns = Math.ceil(Math.sqrt(images.length));
  const rows = Math.ceil(images.length / columns);
  const cellWidth = app.view.width / columns;
  const cellHeight = app.view.height / rows;
  const padding = 10;

  images.forEach((img, index) => {
    const texture = PIXI.Texture.from(formatFileUrl(img.image_url));

    texture.baseTexture.on("loaded", () => {
      const sprite = new PIXI.Sprite(texture);
      sprite.anchor.set(0.5);

      // ✅ Масштабируем картинку пропорционально
      const maxSize = Math.min(cellWidth, cellHeight) - padding * 2;
      const scaleFactor = maxSize / Math.max(sprite.width, sprite.height);
      sprite.scale.set(scaleFactor);

      // 📍 Позиция в сетке
      const col = index % columns;
      const row = Math.floor(index / columns);
      sprite.x = col * cellWidth + cellWidth / 2;
      sprite.y = row * cellHeight + cellHeight / 2;

      // ✅ Рамка
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

        // ✅ Обновляем цвет рамки
        border.clear();
        border.lineStyle(6, img.is_correct ? 0x00ff00 : 0xff0000);
        border.drawRect(-sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
      });

      stage.addChild(border);
      stage.addChild(sprite);
    });
  });

  // console.log("🎉 createImageLayout: рендер завершён");

  // ✅ 🚀 Очистка Pixi при размонтировании компонента (разрыв связки с `useRef`)
  return () => {
    if (pixiAppRef.current) {
      // console.log("❌ createImageLayout: Размонтирование Pixi!");
      pixiAppRef.current.destroy(true, { children: true, texture: true, baseTexture: true });
      pixiAppRef.current = null;
    }
  };
};
