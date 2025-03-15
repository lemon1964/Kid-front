import React from "react";
import { useDrag } from "react-dnd";
import { formatFileUrl } from "@/utils/formatFileUrl";

const ItemComponent: React.FC<{ item: Item }> = ({ item }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "Item",
    item: { id: item.id },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
    ref={(node: HTMLDivElement | null) => {
      if (node) {
        drag(node);
      }
    }}
      className="p-2 rounded-lg shadow-lg hover:scale-105 transition-all transform"
      style={{
        opacity: isDragging ? 0.5 : 1,
        width: "clamp(72px, 9.6vw, 144px)",
        height: "clamp(72px, 9.6vw, 144px)",
      }}
    >
      <img
        src={formatFileUrl(item.image_url.file_url)}
        alt={item.alt_text}
        className="w-full h-full object-contain rounded-full border-4 border-white shadow-xl transition-all hover:shadow-2xl"
      />
      <p className="text-center mt-1 font-bold text-white bg-blue-500 p-1 rounded-md">
        {item.text}
      </p>
    </div>
  );
};

export default ItemComponent;
