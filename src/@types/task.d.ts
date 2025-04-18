// 🔹 Тип для задач с номерами с данными
  interface TaskDataTask {
    type: "pixi" | "quiz" | "dragdrop";
    data: QuizDataType | PixiTask | TaskData;
  }

  interface TaskDataItem {
    unique_id: number;
    title?: string;
    description?: string;
  }

  interface TaskDataList {
    quizzes: TaskDataItem[];
    dragdrops: TaskDataItem[];
    pixi_tasks: TaskDataItem[];
  }
  