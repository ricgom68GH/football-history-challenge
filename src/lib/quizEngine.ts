import type { Phase, Question } from "@/types/quiz";

export function getQuestionsByTopicAndPhase(
  questions: Question[],
  topicId: string,
  phaseId: number,
) {
  return questions.filter(
    (question) => question.topicId === topicId && question.phaseId === phaseId,
  );
}

export function getRandomQuestionsForPhase(
  questions: Question[],
  topicId: string,
  phaseId: number,
  limit = 10,
) {
  const phaseQuestions = getQuestionsByTopicAndPhase(questions, topicId, phaseId);
  const shuffledQuestions = [...phaseQuestions];

  for (let index = shuffledQuestions.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledQuestions[index], shuffledQuestions[randomIndex]] = [
      shuffledQuestions[randomIndex],
      shuffledQuestions[index],
    ];
  }

  return shuffledQuestions.slice(0, limit);
}

export function didPassPhase(score: number, phase: Phase) {
  return score >= phase.requiredScore;
}

export function getPoints(score: number) {
  return score * 100;
}
