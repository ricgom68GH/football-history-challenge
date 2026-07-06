import type { Question } from "@/types/quiz";

export const questions: Question[] = [
  {
    id: 1,
    question: "Qual país venceu a Copa do Mundo de 2022?",
    options: ["França", "Argentina", "Brasil", "Croácia"],
    correctAnswer: "Argentina",
  },
  {
    id: 2,
    question: "Quantos jogadores cada time tem em campo no início de uma partida oficial?",
    options: ["9", "10", "11", "12"],
    correctAnswer: "11",
  },
  {
    id: 3,
    question: "Qual jogador é conhecido como Rei do Futebol?",
    options: ["Maradona", "Pelé", "Zico", "Romario"],
    correctAnswer: "Pelé",
  },
  {
    id: 4,
    question: "Qual clube brasileiro é conhecido como Timão?",
    options: ["Palmeiras", "Santos", "Corinthians", "São Paulo"],
    correctAnswer: "Corinthians",
  },
  {
    id: 5,
    question: "Em uma partida oficial, quanto tempo tem cada tempo do jogo?",
    options: ["30 minutos", "35 minutos", "40 minutos", "45 minutos"],
    correctAnswer: "45 minutos",
  },
  {
    id: 6,
    question: "Qual competição reúne clubes campeões da America do Sul?",
    options: ["Champions League", "Copa Libertadores", "Eurocopa", "Copa do Brasil"],
    correctAnswer: "Copa Libertadores",
  },
  {
    id: 7,
    question: "O que acontece quando um jogador recebe cartão vermelho?",
    options: [
      "Ele cobra um pênalti",
      "Ele é substituído automaticamente",
      "Ele é expulso da partida",
      "O time ganha uma falta",
    ],
    correctAnswer: "Ele é expulso da partida",
  },
  {
    id: 8,
    question: "Qual seleção tem mais títulos de Copa do Mundo masculina?",
    options: ["Alemanha", "Italia", "Brasil", "Argentina"],
    correctAnswer: "Brasil",
  },
  {
    id: 9,
    question: "Qual é o nome da linha que divide o campo ao meio?",
    options: ["Linha lateral", "Linha de meio-campo", "Linha de fundo", "Marca do pênalti"],
    correctAnswer: "Linha de meio-campo",
  },
  {
    id: 10,
    question: "Quando uma partida eliminatória termina empatada e precisa de um vencedor, uma decisão comum e:",
    options: ["Escanteios", "Laterais", "Pênaltis", "Impedimentos"],
    correctAnswer: "Pênaltis",
  },
];

