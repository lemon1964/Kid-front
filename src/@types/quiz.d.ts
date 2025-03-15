interface ObjectType {
    id: number;
    color: string;
    shape: string;
  }
  
  // Общий тип для изображений
  interface ImageType {
    id: number;
    file_url: string;
    title: string;
  }
  
  // Типы данных для викторины
  interface QuizAnswerType {
    id: number;
    text: string;
    is_correct: boolean;
    image_url: ImageType;
    sound?: {
      id: number;
      title: string;
      file_url: string;
    };
  }
  
  interface QuizQuestionType {
    id: number;
    text: string;
    visibility_text: boolean;
    question_type: string;
    answers: QuizAnswerType[];
    images: ImageType[];
  }
  
  interface QuizDataType {
    id: number;
    slug: string;
    title: string;
    description: string;
    music?: {
      id: number;
      title: string;
      file_url: string;
    };
    average_time_per_question: number;
    questions: QuizQuestionType[];
    next_quizzes: {
      id: number;
      title: string;
      slug: string;
    }[];
    page_background: string;
  }

  interface QuizPage extends Page {
    quizzes?: QuizDataType[]
}