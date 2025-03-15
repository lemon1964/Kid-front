import React, { useCallback } from "react";
import { useDrop } from "react-dnd";
import { formatFileUrl } from "@/utils/formatFileUrl";

interface ContainerProps {
  container: Container;
  onDrop: (item: Item, targetContainer: Container) => void;
}

export default function Container({ container, onDrop }: ContainerProps) {
  const [{ isOver }, drop] = useDrop({
    accept: "ITEM",
    drop: (item: Item) => {
      onDrop(item, container);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

    const dropRef = useCallback(
    (node: HTMLDivElement | null) => {
      drop(node);
    },
    [drop]
  );

  return (
    <div
      ref={dropRef}
      className={`border-4 border-dashed rounded-lg p-4 flex items-center justify-center shadow-md bg-gray-50 transition-all duration-300 ${
        isOver ? "border-green-500 bg-green-100" : "border-blue-500"
      }`}
    >
      <img
        src={formatFileUrl(container.image_url?.file_url)}
        alt={container.alt_text}
        className="w-24 h-24 object-contain"
      />
    </div>
  );
}
