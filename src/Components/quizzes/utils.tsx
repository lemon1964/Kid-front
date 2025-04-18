export const calculatePoints = (
  totalQuestions: number,
  correctAnswers: number,
  averageTimePerQuestion: number,
  timePerQuestion?: number
): number => {
  const basePoints = correctAnswers;
  const quizBonus = totalQuestions === correctAnswers ? totalQuestions : 0; // Бонус только при всех правильных
  let timeBonus = 0;

  if (timePerQuestion && timePerQuestion <= averageTimePerQuestion) {
    timeBonus = correctAnswers; // Удвоение очков только за верные ответы
  }

  return basePoints + quizBonus + timeBonus;
};
