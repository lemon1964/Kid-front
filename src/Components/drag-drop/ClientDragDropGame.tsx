"use client";

import { memo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragDrop from "./classification/DragDrop";
import DragDrop2 from "./sequence-completion/DragDrop";

interface ClientDragDropGameProps {
  taskData: TaskDataContinue;
}

const ClientDragDropGame: React.FC<ClientDragDropGameProps> = memo(({ taskData }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      {taskData.name.type.type === "classification" ? (
        <DragDrop taskData={taskData as TaskData} />
      ) : (
        <DragDrop2 taskData={taskData} />
      )}
    </DndProvider>
  );
});

export default ClientDragDropGame;

