import type { QuizProgress } from "@/types/quiz";

const STORAGE_KEY = "gr-games-quiz-progress";

export function getInitialProgress(topicIds: string[]): QuizProgress {
  return topicIds.reduce<QuizProgress>((progress, topicId) => {
    progress[topicId] = 1;
    return progress;
  }, {});
}

export function loadProgress(topicIds: string[]): QuizProgress {
  if (typeof window === "undefined") {
    return getInitialProgress(topicIds);
  }

  const initialProgress = getInitialProgress(topicIds);
  const savedProgress = window.localStorage.getItem(STORAGE_KEY);

  if (!savedProgress) {
    return initialProgress;
  }

  try {
    return { ...initialProgress, ...JSON.parse(savedProgress) };
  } catch {
    return initialProgress;
  }
}

export function saveProgress(progress: QuizProgress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function unlockNextPhase(
  progress: QuizProgress,
  topicId: string,
  currentPhaseId: number,
  totalPhases: number,
) {
  const nextPhaseId = Math.min(currentPhaseId + 1, totalPhases);
  const currentUnlockedPhase = progress[topicId] ?? 1;

  if (nextPhaseId <= currentUnlockedPhase) {
    return progress;
  }

  const updatedProgress = {
    ...progress,
    [topicId]: nextPhaseId,
  };

  saveProgress(updatedProgress);
  return updatedProgress;
}
