import type { Topic } from "@/types/quiz";

export const topics: Topic[] = [
  {
    id: "world-cup",
    name: "Copa do Mundo",
    description: "Teste sua memória sobre seleções, Copas, finais, craques e momentos históricos.",
    icon: "🏆",
  },
  {
    id: "libertadores",
    name: "Libertadores",
    description: "Reviva campanhas, finais, clubes sul-americanos e noites marcantes da América.",
    icon: "🌎",
  },
  {
    id: "champions-league",
    name: "Champions League",
    description: "Mostre que conhece campeões europeus, artilheiros, viradas e grandes finais.",
    icon: "⭐",
  },
  {
    id: "brasileirao",
    name: "Brasileirão",
    description: "Passe por títulos, campanhas, craques e histórias do futebol brasileiro.",
    icon: "🇧🇷",
  },
];
