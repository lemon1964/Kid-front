import React, { useCallback } from "react";
import { useDrop } from "react-dnd";
import { formatFileUrl } from "@/utils/formatFileUrl";


interface ContainerProps {
  container: Container;
  index: number;
  moveItemToContainer: (itemId: number, containerId: number) => void;
}

const Container: React.FC<ContainerProps> = ({ container, index, moveItemToContainer }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "Item",
    drop: (item: { id: number }) => {
      moveItemToContainer(item.id, container.id);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });

  const dropRef = useCallback(
    (node: HTMLDivElement | null) => {
      drop(node);
    },
    [drop]
  );

  const rainbowColors = ["#FF0000", "#FFFF00", "#00FF00", "#0000FF", "#FFA500", "#00FFFF", "#800080"];

  return (
    <div
      ref={dropRef}
      className="relative flex flex-col items-center p-4 rounded-lg shadow-md transition-all duration-300 bg-opacity-80"
      style={{
        backgroundColor: rainbowColors[index % rainbowColors.length],
      }}
    >
      <h2 className="text-center font-bold mb-2 p-2 rounded-lg text-white bg-black bg-opacity-60">
        {container.alt_text}
      </h2>

      <img
        src={formatFileUrl(container.image_url?.file_url)}
        alt={container.alt_text}
        className="w-full h-auto max-h-[70%] object-contain"
      />

      <div className="absolute bottom-2 left-2 flex gap-1">
        {container.items.map(item => (
          <img
            key={item.id}
            src={formatFileUrl(item.image_url.file_url)}
            alt={item.alt_text}
            className="w-6 h-6 rounded-full border border-white"
          />
        ))}
      </div>
    </div>
  );
};

export default Container;
