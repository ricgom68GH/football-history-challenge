import type { Phase, Topic } from "@/types/quiz";

export const ACHIEVEMENTS_STORAGE_KEY = "gr-games-quiz-achievements";

export type RoundMedal = {
  key: "training" | "bronze" | "silver" | "gold" | "diamond";
  name: string;
  label: string;
  icon: string;
  message: string;
  rank: number;
  isMedal: boolean;
};

export type Achievement = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

export type AchievementState = {
  unlockedAchievementIds: string[];
  playedTopicIds: string[];
  passedPhaseKeys: string[];
  bestMedalsByPhase: Record<string, RoundMedal["key"]>;
};

export type CompletedRound = {
  topicId: Topic["id"];
  phaseId: Phase["id"];
  score: number;
  totalQuestions: number;
  passed: boolean;
};

const EMPTY_STATE: AchievementState = {
  unlockedAchievementIds: [],
  playedTopicIds: [],
  passedPhaseKeys: [],
  bestMedalsByPhase: {},
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-win",
    name: "Primeira Vit\u00f3ria",
    icon: "\ud83d\udfe2",
    description: "Passe uma fase pela primeira vez.",
  },
  {
    id: "first-bronze",
    name: "Primeiro Bronze",
    icon: "\ud83e\udd49",
    description: "Conquiste sua primeira Medalha Bronze ou superior.",
  },
  {
    id: "first-gold",
    name: "Primeiro Ouro",
    icon: "\ud83e\udd47",
    description: "Conquiste sua primeira Medalha Ouro.",
  },
  {
    id: "diamond",
    name: "Diamante!",
    icon: "\ud83d\udc8e",
    description: "Fa\u00e7a 10/10 em qualquer fase.",
  },
  {
    id: "on-fire",
    name: "Embalado",
    icon: "\ud83d\ude80",
    description: "Passe 3 fases no total.",
  },
  {
    id: "world-cup-master",
    name: "Mestre da Copa",
    icon: "\ud83c\udf0e",
    description: "Passe todas as fases de Copa do Mundo.",
  },
  {
    id: "championship-king",
    name: "Rei dos Campeonatos",
    icon: "\ud83d\udc51",
    description: "Passe pelo menos uma fase em cada tema.",
  },
  {
    id: "football-historian",
    name: "Historiador do Futebol",
    icon: "\ud83d\udcda",
    description: "Jogue pelo menos uma fase em todos os temas.",
  },
];

const TOPIC_IDS = ["world-cup", "libertadores", "champions-league", "brasileirao"];
const WORLD_CUP_PHASE_KEYS = [1, 2, 3, 4, 5].map((phaseId) => getPhaseKey("world-cup", phaseId));
const MEDAL_RANKS: Record<RoundMedal["key"], number> = {
  training: 0,
  bronze: 1,
  silver: 2,
  gold: 3,
  diamond: 4,
};

export function getPhaseKey(topicId: string, phaseId: number) {
  return `${topicId}-phase${phaseId}`;
}

export function getRoundMedal(score: number, totalQuestions = 10): RoundMedal {
  if (score === totalQuestions) {
    return {
      key: "diamond",
      name: "Diamante",
      label: "Medalha Diamante",
      icon: "\ud83d\udc8e",
      message: "Perfeito! Voc\u00ea conquistou a Medalha Diamante.",
      rank: MEDAL_RANKS.diamond,
      isMedal: true,
    };
  }

  if (score >= 8) {
    return {
      key: "gold",
      name: "Ouro",
      label: "Medalha Ouro",
      icon: "\ud83e\udd47",
      message: "Voc\u00ea conquistou a Medalha Ouro.",
      rank: MEDAL_RANKS.gold,
      isMedal: true,
    };
  }

  if (score >= 6) {
    return {
      key: "silver",
      name: "Prata",
      label: "Medalha Prata",
      icon: "\ud83e\udd48",
      message: "Voc\u00ea conquistou a Medalha Prata.",
      rank: MEDAL_RANKS.silver,
      isMedal: true,
    };
  }

  if (score >= 4) {
    return {
      key: "bronze",
      name: "Bronze",
      label: "Medalha Bronze",
      icon: "\ud83e\udd49",
      message: "Voc\u00ea conquistou a Medalha Bronze.",
      rank: MEDAL_RANKS.bronze,
      isMedal: true,
    };
  }

  return {
    key: "training",
    name: "Continue treinando",
    label: "Continue treinando",
    icon: "\ud83d\udcaa",
    message: "Voc\u00ea ainda n\u00e3o ganhou medalha nessa rodada, mas pode tentar novamente.",
    rank: MEDAL_RANKS.training,
    isMedal: false,
  };
}

export function getInitialAchievementState(): AchievementState {
  return { ...EMPTY_STATE, bestMedalsByPhase: {} };
}

export function loadAchievementState(): AchievementState {
  if (typeof window === "undefined") {
    return getInitialAchievementState();
  }

  const savedAchievements = window.localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);

  if (!savedAchievements) {
    return getInitialAchievementState();
  }

  try {
    const parsedState = JSON.parse(savedAchievements) as Partial<AchievementState>;

    return {
      unlockedAchievementIds: Array.isArray(parsedState.unlockedAchievementIds)
        ? parsedState.unlockedAchievementIds
        : [],
      playedTopicIds: Array.isArray(parsedState.playedTopicIds) ? parsedState.playedTopicIds : [],
      passedPhaseKeys: Array.isArray(parsedState.passedPhaseKeys) ? parsedState.passedPhaseKeys : [],
      bestMedalsByPhase: parsedState.bestMedalsByPhase && typeof parsedState.bestMedalsByPhase === "object"
        ? parsedState.bestMedalsByPhase
        : {},
    };
  } catch {
    return getInitialAchievementState();
  }
}

export function saveAchievementState(state: AchievementState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(state));
}

export function getUnlockedAchievements(state = loadAchievementState()) {
  const unlockedIds = new Set(state.unlockedAchievementIds);
  return ACHIEVEMENTS.filter((achievement) => unlockedIds.has(achievement.id));
}

export function completeQuizRound(round: CompletedRound) {
  const currentState = loadAchievementState();
  const medal = getRoundMedal(round.score, round.totalQuestions);
  const phaseKey = getPhaseKey(round.topicId, round.phaseId);
  const playedTopicIds = unique([...currentState.playedTopicIds, round.topicId]);
  const passedPhaseKeys = round.passed
    ? unique([...currentState.passedPhaseKeys, phaseKey])
    : currentState.passedPhaseKeys;
  const currentBestMedal = currentState.bestMedalsByPhase[phaseKey];
  const bestMedalsByPhase =
    !currentBestMedal || medal.rank > MEDAL_RANKS[currentBestMedal]
      ? { ...currentState.bestMedalsByPhase, [phaseKey]: medal.key }
      : currentState.bestMedalsByPhase;

  const nextState: AchievementState = {
    unlockedAchievementIds: currentState.unlockedAchievementIds,
    playedTopicIds,
    passedPhaseKeys,
    bestMedalsByPhase,
  };

  const unlockedIds = new Set(nextState.unlockedAchievementIds);
  const newAchievements = ACHIEVEMENTS.filter((achievement) => {
    if (unlockedIds.has(achievement.id)) {
      return false;
    }

    return isAchievementUnlocked(achievement.id, round, nextState, medal);
  });

  const updatedState: AchievementState = {
    ...nextState,
    unlockedAchievementIds: unique([
      ...nextState.unlockedAchievementIds,
      ...newAchievements.map((achievement) => achievement.id),
    ]),
  };

  saveAchievementState(updatedState);

  return {
    state: updatedState,
    medal,
    newAchievements,
  };
}

function isAchievementUnlocked(
  achievementId: Achievement["id"],
  round: CompletedRound,
  state: AchievementState,
  medal: RoundMedal,
) {
  switch (achievementId) {
    case "first-win":
      return round.passed;
    case "first-bronze":
      return medal.rank >= MEDAL_RANKS.bronze;
    case "first-gold":
      return medal.rank >= MEDAL_RANKS.gold;
    case "diamond":
      return round.score === round.totalQuestions;
    case "on-fire":
      return state.passedPhaseKeys.length >= 3;
    case "world-cup-master":
      return WORLD_CUP_PHASE_KEYS.every((phaseKey) => state.passedPhaseKeys.includes(phaseKey));
    case "championship-king":
      return TOPIC_IDS.every((topicId) =>
        state.passedPhaseKeys.some((phaseKey) => phaseKey.startsWith(`${topicId}-phase`)),
      );
    case "football-historian":
      return TOPIC_IDS.every((topicId) => state.playedTopicIds.includes(topicId));
    default:
      return false;
  }
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}