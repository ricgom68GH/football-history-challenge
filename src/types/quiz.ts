export type Difficulty = "facil" | "medio" | "dificil";

export type GameMode = "solo" | "private_duel";

export type Topic = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type Phase = {
  id: number;
  name: string;
  description: string;
  requiredScore: number;
};

export type Question = {
  code: string;
  id: string;
  topicId: string;
  phaseId: number;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  subthemeCode?: string;
  subtheme?: string;
  characterType?: string;
};

export type QuizProgress = Record<string, number>;

