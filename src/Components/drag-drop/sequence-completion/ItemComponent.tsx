import { useDrag } from "react-dnd";
import Image from "next/image";
import { formatFileUrl } from "@/utils/formatFileUrl";

interface ItemComponentProps {
  item: Item;
}

export default function ItemComponent({ item }: ItemComponentProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "ITEM",
    item: { ...item, targetContainerId: null },
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
      className={`cursor-pointer p-2 border-4 border-blue-500 rounded-lg shadow bg-white transform hover:scale-105 transition-all duration-300 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Image
        src={formatFileUrl(item.image_url.file_url)}
        alt={item.alt_text}
        width={80}
        height={80}
        className="w-20 h-20 object-contain"
      />
    </div>
  );
}
