// import { Item } from "@/types";
import ItemComponent2 from "./ItemComponent";

interface ItemListProps {
  items: Item[];
}

export default function ItemList({ items }: ItemListProps) {
  return (
    <div className="flex flex-wrap gap-4 mt-6 p-4 border-4 border-blue-400 rounded-lg shadow-lg bg-green-100">
      {items.map((item) => (
        <ItemComponent2 key={item.id} item={item} />
      ))}
    </div>
  );
}
