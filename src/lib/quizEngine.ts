import type { Phase, Question } from "@/types/quiz";

export const worldCupPhase1SubthemeDistribution: Record<string, number> = {
  CF: 1, PF: 2, JH: 2, EP: 1, RE: 1, CB: 1, MC: 1,
};

export const worldCupPhase2SubthemeDistribution = worldCupPhase1SubthemeDistribution;
export const worldCupPhase3SubthemeDistribution = worldCupPhase1SubthemeDistribution;
export const worldCupPhase4SubthemeDistribution = worldCupPhase1SubthemeDistribution;
export const worldCupPhase5SubthemeDistribution = worldCupPhase1SubthemeDistribution;

export function getQuestionsByTopicAndPhase(
  questions: Question[],
  topicId: string,
  phaseId: number,
) {
  return questions.filter(
    (question) => question.topicId === topicId && question.phaseId === phaseId,
  );
}

export function shuffleQuestions<T>(questions: T[], random = Math.random) {
  const shuffled = [...questions];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

export function groupQuestionsBySubtheme(questions: Question[]) {
  return questions.reduce<Record<string, Question[]>>((groups, question) => {
    if (question.subthemeCode) {
      (groups[question.subthemeCode] ??= []).push(question);
    }
    return groups;
  }, {});
}

export function fillRemainingQuestions(
  selected: Question[],
  allQuestions: Question[],
  total: number,
  random = Math.random,
) {
  const selectedIds = new Set(selected.map((question) => question.id));
  const remaining = shuffleQuestions(
    allQuestions.filter((question) => !selectedIds.has(question.id)),
    random,
  );
  return [...selected, ...remaining.slice(0, Math.max(0, total - selected.length))];
}

export function getRandomQuestionsBySubtheme(
  questions: Question[],
  distribution: Record<string, number>,
  total = 10,
  random = Math.random,
) {
  const grouped = groupQuestionsBySubtheme(questions);
  const selected: Question[] = [];
  for (const [code, amount] of Object.entries(distribution)) {
    selected.push(...shuffleQuestions(grouped[code] ?? [], random).slice(0, amount));
  }

  const selectedIds = new Set(selected.map((question) => question.id));
  const preferred = ["PF", "JH", "CF", "RE", "CB", "MC"];
  const eligible = preferred.filter((code) =>
    (grouped[code] ?? []).some((question) => !selectedIds.has(question.id)),
  );

  if (selected.length < total && eligible.length > 0) {
    const code = eligible[Math.floor(random() * eligible.length)];
    const candidates = shuffleQuestions(
      (grouped[code] ?? []).filter((question) => !selectedIds.has(question.id)),
      random,
    );
    selected.push(...candidates.slice(0, 1));
  }

  return shuffleQuestions(fillRemainingQuestions(selected, questions, total, random), random);
}

export function getRandomQuestionsForPhase(
  questions: Question[],
  topicId: string,
  phaseId: number,
  limit = 10,
) {
  const phaseQuestions = getQuestionsByTopicAndPhase(questions, topicId, phaseId);
  if (topicId === "world-cup" && (phaseId >= 1 && phaseId <= 5)) {
    const distribution = phaseId === 1
      ? worldCupPhase1SubthemeDistribution
      : phaseId === 2
        ? worldCupPhase2SubthemeDistribution
        : phaseId === 3
          ? worldCupPhase3SubthemeDistribution
          : phaseId === 4
            ? worldCupPhase4SubthemeDistribution
            : worldCupPhase5SubthemeDistribution;
    return getRandomQuestionsBySubtheme(
      phaseQuestions,
      distribution,
      limit,
    );
  }
  return shuffleQuestions(phaseQuestions).slice(0, limit);
}

export function didPassPhase(score: number, phase: Phase) {
  return score >= phase.requiredScore;
}

export function getPoints(score: number) {
  return score * 100;
}
