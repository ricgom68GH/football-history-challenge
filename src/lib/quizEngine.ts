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

export function didPassPhase(score: number, phase: Phase) {
  return score >= phase.requiredScore;
}

export function getPoints(score: number) {
  return score * 100;
}
