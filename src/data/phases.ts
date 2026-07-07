import type { Phase } from "@/types/quiz";

export const phases: Phase[] = [
  {
    id: 1,
    name: "Aquecimento",
    description: "Perguntas mais conhecidas para entrar no clima do tema.",
    requiredScore: 6,
  },
  {
    id: 2,
    name: "Torcedor Raiz",
    description: "Perguntas intermediárias sobre clubes, seleções, jogadores e títulos.",
    requiredScore: 7,
  },
  {
    id: 3,
    name: "Craque da História",
    description: "Perguntas históricas mais específicas para quem acompanha de verdade.",
    requiredScore: 7,
  },
  {
    id: 4,
    name: "Memória de Campeão",
    description: "Campanhas, finais, artilheiros, técnicos e momentos marcantes.",
    requiredScore: 8,
  },
  {
    id: 5,
    name: "Lenda do Futebol",
    description: "Detalhes históricos difíceis para fechar a jornada como lenda.",
    requiredScore: 8,
  },
];
