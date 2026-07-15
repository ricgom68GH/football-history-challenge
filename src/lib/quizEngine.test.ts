import assert from "node:assert/strict";
import test from "node:test";
import {
  fillRemainingQuestions,
  getRandomQuestionsBySubtheme,
  groupQuestionsBySubtheme,
  worldCupPhase1SubthemeDistribution,
  worldCupPhase2SubthemeDistribution,
  worldCupPhase3SubthemeDistribution,
  worldCupPhase4SubthemeDistribution,
  worldCupPhase5SubthemeDistribution,
  libertadoresPhase1SubthemeDistribution,
  libertadoresPhase2SubthemeDistribution,
  libertadoresPhase3SubthemeDistribution,
  libertadoresPhase4SubthemeDistribution,
  libertadoresPhase5SubthemeDistribution,
  championsLeagueSubthemeDistribution,
  brasileiraoSubthemeDistribution,
} from "./quizEngine.ts";
import { worldCupPhase1Questions } from "../data/question-bank/world-cup/phase1.ts";
import { worldCupPhase2Questions } from "../data/question-bank/world-cup/phase2.ts";
import { worldCupPhase3Questions } from "../data/question-bank/world-cup/phase3.ts";
import { worldCupPhase4Questions } from "../data/question-bank/world-cup/phase4.ts";
import { worldCupPhase5Questions } from "../data/question-bank/world-cup/phase5.ts";
import { libertadoresPhase1Questions } from "../data/question-bank/libertadores/phase1.ts";
import { libertadoresPhase2Questions } from "../data/question-bank/libertadores/phase2.ts";
import { libertadoresPhase3Questions } from "../data/question-bank/libertadores/phase3.ts";
import { libertadoresPhase4Questions } from "../data/question-bank/libertadores/phase4.ts";
import { libertadoresPhase5Questions } from "../data/question-bank/libertadores/phase5.ts";
import { championsLeaguePhase1Questions } from "../data/question-bank/champions-league/phase1.ts";
import { championsLeaguePhase2Questions } from "../data/question-bank/champions-league/phase2.ts";
import { championsLeaguePhase3Questions } from "../data/question-bank/champions-league/phase3.ts";
import { championsLeaguePhase4Questions } from "../data/question-bank/champions-league/phase4.ts";
import { championsLeaguePhase5Questions } from "../data/question-bank/champions-league/phase5.ts";
import { brasileiraoPhase1Questions } from "../data/question-bank/brasileirao/phase1.ts";
import { brasileiraoPhase2Questions } from "../data/question-bank/brasileirao/phase2.ts";
import { brasileiraoPhase3Questions } from "../data/question-bank/brasileirao/phase3.ts";
import { brasileiraoPhase4Questions } from "../data/question-bank/brasileirao/phase4.ts";
import { brasileiraoPhase5Questions } from "../data/question-bank/brasileirao/phase5.ts";
import type { Question } from "../types/quiz.ts";

const constantRandom = () => 0.25;

test("groups all questions by subtheme", () => {
  const groups = groupQuestionsBySubtheme(worldCupPhase1Questions);
  assert.deepEqual(
    Object.fromEntries(Object.entries(groups).map(([code, items]) => [code, items.length])),
    { CF: 4, PF: 6, JH: 5, EP: 3, RE: 4, CB: 4, MC: 4 },
  );
});

test("selects ten unique questions with the base distribution", () => {
  const selected = getRandomQuestionsBySubtheme(
    worldCupPhase1Questions,
    worldCupPhase1SubthemeDistribution,
    10,
    constantRandom,
  );
  const counts = selected.reduce<Record<string, number>>((result, question) => {
    result[question.subthemeCode!] = (result[question.subthemeCode!] ?? 0) + 1;
    return result;
  }, {});

  assert.equal(selected.length, 10);
  assert.equal(new Set(selected.map((question) => question.id)).size, 10);
  for (const [code, amount] of Object.entries(worldCupPhase1SubthemeDistribution)) {
    assert.ok((counts[code] ?? 0) >= amount);
  }
});

test("fills missing subtheme quotas from unused questions", () => {
  const withoutEp = worldCupPhase1Questions.filter(
    (question) => question.subthemeCode !== "EP",
  );
  const selected = getRandomQuestionsBySubtheme(
    withoutEp,
    worldCupPhase1SubthemeDistribution,
    10,
    constantRandom,
  );

  assert.equal(selected.length, 10);
  assert.equal(new Set(selected.map((question) => question.id)).size, 10);
});

test("never returns more questions than exist", () => {
  const fewQuestions = worldCupPhase1Questions.slice(0, 6);
  const selected = getRandomQuestionsBySubtheme(
    fewQuestions,
    worldCupPhase1SubthemeDistribution,
    10,
    constantRandom,
  );
  assert.equal(selected.length, 6);
  assert.equal(new Set(selected.map((question) => question.id)).size, 6);
});

test("fillRemainingQuestions does not duplicate selected IDs", () => {
  const selected = worldCupPhase1Questions.slice(0, 2);
  const filled = fillRemainingQuestions(
    selected,
    worldCupPhase1Questions,
    10,
    constantRandom,
  );
  assert.equal(filled.length, 10);
  assert.equal(new Set(filled.map((question) => question.id)).size, 10);
});

test("a retry performs a fresh draw", () => {
  const valuesA = [0.01, 0.15, 0.29, 0.43, 0.57, 0.71, 0.85, 0.99];
  const valuesB = [...valuesA].reverse();
  let indexA = 0;
  let indexB = 0;
  const drawA = getRandomQuestionsBySubtheme(
    worldCupPhase1Questions,
    worldCupPhase1SubthemeDistribution,
    10,
    () => valuesA[indexA++ % valuesA.length],
  );
  const drawB = getRandomQuestionsBySubtheme(
    worldCupPhase1Questions,
    worldCupPhase1SubthemeDistribution,
    10,
    () => valuesB[indexB++ % valuesB.length],
  );

  assert.notDeepEqual(
    drawA.map((question) => question.id),
    drawB.map((question) => question.id),
  );
});

test("phase 2 bank is valid and uses the balanced draw", () => {
  assert.equal(worldCupPhase2Questions.length, 30);
  assert.equal(new Set(worldCupPhase2Questions.map((question) => question.id)).size, 30);
  assert.ok(worldCupPhase2Questions.every((question) => question.id.startsWith("CM-F2-")));
  assert.ok(worldCupPhase2Questions.every((question) => question.options.length === 4));
  assert.ok(worldCupPhase2Questions.every((question) => question.options.includes(question.correctAnswer)));
  assert.ok(worldCupPhase2Questions.every((question) => question.subthemeCode));

  const groups = groupQuestionsBySubtheme(worldCupPhase2Questions);
  assert.deepEqual(
    Object.fromEntries(Object.entries(groups).map(([code, items]) => [code, items.length])),
    { CF: 4, PF: 6, JH: 5, EP: 3, RE: 4, CB: 4, MC: 4 },
  );

  for (const [code, items] of Object.entries(groups)) {
    assert.deepEqual(
      items.map((question) => question.id),
      items.map((_, index) => `CM-F2-${code}-${String(index + 1).padStart(3, "0")}`),
    );
  }

  const selected = getRandomQuestionsBySubtheme(
    worldCupPhase2Questions,
    worldCupPhase2SubthemeDistribution,
    10,
    constantRandom,
  );
  assert.equal(selected.length, 10);
  assert.equal(new Set(selected.map((question) => question.id)).size, 10);

  const counts = selected.reduce<Record<string, number>>((result, question) => {
    result[question.subthemeCode!] = (result[question.subthemeCode!] ?? 0) + 1;
    return result;
  }, {});
  for (const [code, amount] of Object.entries(worldCupPhase2SubthemeDistribution)) {
    assert.ok((counts[code] ?? 0) >= amount);
  }
});

test("phase 1 remains valid beside phase 2", () => {
  assert.equal(worldCupPhase1Questions.length, 30);
  const allIds = [...worldCupPhase1Questions, ...worldCupPhase2Questions].map(
    (question) => question.id,
  );
  assert.equal(new Set(allIds).size, 60);
});

test("phase 3 bank is valid and uses the balanced draw", () => {
  assert.equal(worldCupPhase3Questions.length, 30);
  assert.equal(new Set(worldCupPhase3Questions.map((question) => question.id)).size, 30);
  assert.ok(worldCupPhase3Questions.every((question) => question.id.startsWith("CM-F3-")));
  assert.ok(worldCupPhase3Questions.every((question) => question.options.length === 4));
  assert.ok(worldCupPhase3Questions.every((question) => new Set(question.options).size === 4));
  assert.ok(worldCupPhase3Questions.every((question) => question.options.every(Boolean)));
  assert.ok(worldCupPhase3Questions.every((question) => question.options.includes(question.correctAnswer)));
  assert.ok(worldCupPhase3Questions.every((question) => question.subthemeCode));
  const groups = groupQuestionsBySubtheme(worldCupPhase3Questions);
  assert.deepEqual(Object.fromEntries(Object.entries(groups).map(([code, items]) => [code, items.length])), { CF: 4, PF: 6, JH: 5, EP: 3, RE: 4, CB: 4, MC: 4 });
  for (const [code, items] of Object.entries(groups)) {
    assert.deepEqual(items.map((question) => question.id), items.map((_, index) => `CM-F3-${code}-${String(index + 1).padStart(3, "0")}`));
  }
  const selected = getRandomQuestionsBySubtheme(worldCupPhase3Questions, worldCupPhase3SubthemeDistribution, 10, constantRandom);
  assert.equal(selected.length, 10);
  assert.equal(new Set(selected.map((question) => question.id)).size, 10);
  const counts = selected.reduce<Record<string, number>>((result, question) => {
    result[question.subthemeCode!] = (result[question.subthemeCode!] ?? 0) + 1;
    return result;
  }, {});
  for (const [code, amount] of Object.entries(worldCupPhase3SubthemeDistribution)) assert.ok((counts[code] ?? 0) >= amount);
});

test("phase 3 preserves the two required corrections", () => {
  const goalkeeper = worldCupPhase3Questions.find((question) => question.id === "CM-F3-PF-005");
  const denmarkMatch = worldCupPhase3Questions.find((question) => question.id === "CM-F3-JH-001");
  assert.match(goalkeeper?.question ?? "", /três cobranças/);
  assert.equal(goalkeeper?.correctAnswer, "Ricardo");
  assert.match(denmarkMatch?.question ?? "", /5 a 1/);
  assert.equal(denmarkMatch?.correctAnswer, "Espanha");
});

test("all three subthemed World Cup phases remain compatible", () => {
  const all = [...worldCupPhase1Questions, ...worldCupPhase2Questions, ...worldCupPhase3Questions];
  assert.equal(all.length, 90);
  assert.equal(new Set(all.map((question) => question.id)).size, 90);
});
test("phase 4 bank is valid and uses the balanced draw", () => {
  assert.equal(worldCupPhase4Questions.length, 30);
  assert.equal(new Set(worldCupPhase4Questions.map((question) => question.id)).size, 30);
  assert.ok(worldCupPhase4Questions.every((question) => question.id.startsWith("CM-F4-")));
  assert.ok(worldCupPhase4Questions.every((question) => question.options.length === 4));
  assert.ok(worldCupPhase4Questions.every((question) => new Set(question.options).size === 4));
  assert.ok(worldCupPhase4Questions.every((question) => question.options.every(Boolean)));
  assert.ok(worldCupPhase4Questions.every((question) => question.options.includes(question.correctAnswer)));
  assert.ok(worldCupPhase4Questions.every((question) => question.subthemeCode));
  const groups = groupQuestionsBySubtheme(worldCupPhase4Questions);
  assert.deepEqual(Object.fromEntries(Object.entries(groups).map(([code, items]) => [code, items.length])), { CF: 4, PF: 6, JH: 5, EP: 3, RE: 4, CB: 4, MC: 4 });
  for (const [code, items] of Object.entries(groups)) {
    assert.deepEqual(items.map((question) => question.id), items.map((_, index) => `CM-F4-${code}-${String(index + 1).padStart(3, "0")}`));
  }
  const selected = getRandomQuestionsBySubtheme(worldCupPhase4Questions, worldCupPhase4SubthemeDistribution, 10, constantRandom);
  assert.equal(selected.length, 10);
  assert.equal(new Set(selected.map((question) => question.id)).size, 10);
  const counts = selected.reduce<Record<string, number>>((result, question) => {
    result[question.subthemeCode!] = (result[question.subthemeCode!] ?? 0) + 1;
    return result;
  }, {});
  for (const [code, amount] of Object.entries(worldCupPhase4SubthemeDistribution)) assert.ok((counts[code] ?? 0) >= amount);
});

test("phase 4 preserves the five reviewed CSV questions", () => {
  const expected = new Map([
    ["CM-F4-CF-001", ["último gol do Uruguai", "Héctor Castro"]],
    ["CM-F4-JH-003", ["Suíça por 3 a 0", "Espanha"]],
    ["CM-F4-JH-005", ["União Soviética por 4 a 3", "Bélgica"]],
    ["CM-F4-RE-002", ["10 a 1", "El Salvador"]],
    ["CM-F4-MC-002", ["Thomas N'Kono", "Espanyol"]],
  ]);
  for (const [id, [questionText, answer]] of expected) {
    const question = worldCupPhase4Questions.find((item) => item.id === id);
    assert.match(question?.question ?? "", new RegExp(questionText));
    assert.equal(question?.correctAnswer, answer);
  }
});

test("all four subthemed World Cup phases remain compatible", () => {
  const all = [...worldCupPhase1Questions, ...worldCupPhase2Questions, ...worldCupPhase3Questions, ...worldCupPhase4Questions];
  assert.equal(all.length, 120);
  assert.equal(new Set(all.map((question) => question.id)).size, 120);
});
test("phase 5 bank is valid and uses the balanced draw", () => {
  assert.equal(worldCupPhase5Questions.length, 30);
  assert.equal(new Set(worldCupPhase5Questions.map((question) => question.id)).size, 30);
  assert.ok(worldCupPhase5Questions.every((question) => question.id.startsWith("CM-F5-")));
  assert.ok(worldCupPhase5Questions.every((question) => question.options.length === 4));
  assert.ok(worldCupPhase5Questions.every((question) => new Set(question.options).size === 4));
  assert.ok(worldCupPhase5Questions.every((question) => question.options.every(Boolean)));
  assert.ok(worldCupPhase5Questions.every((question) => question.options.includes(question.correctAnswer)));
  assert.ok(worldCupPhase5Questions.every((question) => question.subthemeCode));
  const groups = groupQuestionsBySubtheme(worldCupPhase5Questions);
  assert.deepEqual(Object.fromEntries(Object.entries(groups).map(([code, items]) => [code, items.length])), { CF: 4, PF: 6, JH: 5, EP: 3, RE: 4, CB: 4, MC: 4 });
  for (const [code, items] of Object.entries(groups)) {
    assert.deepEqual(items.map((question) => question.id), items.map((_, index) => `CM-F5-${code}-${String(index + 1).padStart(3, "0")}`));
  }
  const selected = getRandomQuestionsBySubtheme(worldCupPhase5Questions, worldCupPhase5SubthemeDistribution, 10, constantRandom);
  assert.equal(selected.length, 10);
  assert.equal(new Set(selected.map((question) => question.id)).size, 10);
  const counts = selected.reduce<Record<string, number>>((result, question) => {
    result[question.subthemeCode!] = (result[question.subthemeCode!] ?? 0) + 1;
    return result;
  }, {});
  for (const [code, amount] of Object.entries(worldCupPhase5SubthemeDistribution)) assert.ok((counts[code] ?? 0) >= amount);
});

test("phase 5 preserves the nine reviewed CSV questions", () => {
  const expected = new Map([
    ["CM-F5-JH-003", ["União Soviética por 1 a 0", "Uruguai"]],
    ["CM-F5-JH-004", ["Holanda por 3 a 2", "Escócia"]],
    ["CM-F5-PF-004", ["goleiro foi um dos principais destaques", "Badou Zaki"]],
    ["CM-F5-JH-002", ["Inglaterra por 1 a 0", "Estados Unidos"]],
    ["CM-F5-EP-003", ["final da Copa do Mundo de 2002", "Estádio Internacional de Yokohama"]],
    ["CM-F5-RE-002", ["2010 invicta", "Nova Zelândia"]],
    ["CM-F5-CB-002", ["jogador do Zaire saiu da barreira", "Mwepu Ilunga"]],
    ["CM-F5-MC-002", ["Cha Bum-kun", "Bayer Leverkusen"]],
    ["CM-F5-MC-004", ["Hugo Sánchez", "Real Madrid"]],
  ]);
  for (const [id, [questionText, answer]] of expected) {
    const question = worldCupPhase5Questions.find((item) => item.id === id);
    assert.match(question?.question ?? "", new RegExp(questionText));
    assert.equal(question?.correctAnswer, answer);
  }
});

test("all five subthemed World Cup phases remain compatible", () => {
  const all = [...worldCupPhase1Questions, ...worldCupPhase2Questions, ...worldCupPhase3Questions, ...worldCupPhase4Questions, ...worldCupPhase5Questions];
  assert.equal(all.length, 150);
  assert.equal(new Set(all.map((question) => question.id)).size, 150);
});
test("Libertadores phase 1 bank is valid and uses the balanced draw", () => {
  assert.equal(libertadoresPhase1Questions.length, 30);
  assert.equal(new Set(libertadoresPhase1Questions.map((question) => question.id)).size, 30);
  assert.ok(libertadoresPhase1Questions.every((question) => question.id.startsWith("LB-F1-")));
  assert.ok(libertadoresPhase1Questions.every((question) => question.options.length === 4));
  assert.ok(libertadoresPhase1Questions.every((question) => new Set(question.options).size === 4));
  assert.ok(libertadoresPhase1Questions.every((question) => question.options.every(Boolean)));
  assert.ok(libertadoresPhase1Questions.every((question) => question.options.includes(question.correctAnswer)));
  assert.ok(libertadoresPhase1Questions.every((question) => question.subthemeCode));
  const groups = groupQuestionsBySubtheme(libertadoresPhase1Questions);
  assert.deepEqual(Object.fromEntries(Object.entries(groups).map(([code, items]) => [code, items.length])), { CF: 4, PF: 6, JH: 5, EP: 3, RE: 4, CB: 4, MC: 4 });
  for (const [code, items] of Object.entries(groups)) {
    assert.deepEqual(items.map((question) => question.id), items.map((_, index) => `LB-F1-${code}-${String(index + 1).padStart(3, "0")}`));
  }
  const selected = getRandomQuestionsBySubtheme(libertadoresPhase1Questions, libertadoresPhase1SubthemeDistribution, 10, constantRandom);
  assert.equal(selected.length, 10);
  assert.equal(new Set(selected.map((question) => question.id)).size, 10);
  const counts = selected.reduce<Record<string, number>>((result, question) => {
    result[question.subthemeCode!] = (result[question.subthemeCode!] ?? 0) + 1;
    return result;
  }, {});
  for (const [code, amount] of Object.entries(libertadoresPhase1SubthemeDistribution)) assert.ok((counts[code] ?? 0) >= amount);
});

test("Libertadores phase 1 preserves reviewed and reformulated questions", () => {
  const expectedAnswers = new Map([
    ["LB-F1-RE-002", "Colo-Colo"],
    ["LB-F1-RE-004", "Olimpia"],
    ["LB-F1-PF-006", "Wilmar Barrios"],
    ["LB-F1-JH-005", "Chivas Guadalajara"],
    ["LB-F1-CB-003", "Estudiantes de Mérida"],
    ["LB-F1-MC-002", "Inter de Milão"],
    ["LB-F1-MC-003", "Porto"],
    ["LB-F1-MC-004", "Manchester City"],
    ["LB-F1-JH-002", "Emerson Sheik"],
    ["LB-F1-JH-004", "José Francisco Cevallos"],
  ]);
  for (const [id, answer] of expectedAnswers) {
    assert.equal(libertadoresPhase1Questions.find((question) => question.id === id)?.correctAnswer, answer);
  }
});

test("Libertadores IDs do not conflict with the five World Cup phases", () => {
  const all = [...worldCupPhase1Questions, ...worldCupPhase2Questions, ...worldCupPhase3Questions, ...worldCupPhase4Questions, ...worldCupPhase5Questions, ...libertadoresPhase1Questions];
  assert.equal(all.length, 180);
  assert.equal(new Set(all.map((question) => question.id)).size, 180);
});
test("Libertadores phase 2 bank is valid and uses the balanced draw", () => {
  assert.equal(libertadoresPhase2Questions.length, 30);
  assert.equal(new Set(libertadoresPhase2Questions.map((question) => question.id)).size, 30);
  assert.ok(libertadoresPhase2Questions.every((question) => question.id.startsWith("LB-F2-")));
  assert.ok(libertadoresPhase2Questions.every((question) => question.options.length === 4));
  assert.ok(libertadoresPhase2Questions.every((question) => new Set(question.options).size === 4));
  assert.ok(libertadoresPhase2Questions.every((question) => question.options.every(Boolean)));
  assert.ok(libertadoresPhase2Questions.every((question) => question.options.includes(question.correctAnswer)));
  assert.ok(libertadoresPhase2Questions.every((question) => question.subthemeCode));
  const groups = groupQuestionsBySubtheme(libertadoresPhase2Questions);
  assert.deepEqual(Object.fromEntries(Object.entries(groups).map(([code, items]) => [code, items.length])), { CF: 4, PF: 6, JH: 5, EP: 3, RE: 4, CB: 4, MC: 4 });
  for (const [code, items] of Object.entries(groups)) {
    assert.deepEqual(items.map((question) => question.id), items.map((_, index) => `LB-F2-${code}-${String(index + 1).padStart(3, "0")}`));
  }
  const selected = getRandomQuestionsBySubtheme(libertadoresPhase2Questions, libertadoresPhase2SubthemeDistribution, 10, constantRandom);
  assert.equal(selected.length, 10);
  assert.equal(new Set(selected.map((question) => question.id)).size, 10);
  const counts = selected.reduce<Record<string, number>>((result, question) => {
    result[question.subthemeCode!] = (result[question.subthemeCode!] ?? 0) + 1;
    return result;
  }, {});
  for (const [code, amount] of Object.entries(libertadoresPhase2SubthemeDistribution)) assert.ok((counts[code] ?? 0) >= amount);
});

test("Libertadores phase 2 preserves the seven reviewed questions", () => {
  const expectedAnswers = new Map([
    ["LB-F2-PF-001", "Elivélton"],
    ["LB-F2-JH-002", "Flamengo"],
    ["LB-F2-PF-003", "Edgardo Bauza"],
    ["LB-F2-EP-002", "Assunção"],
    ["LB-F2-RE-002", "Bolívar"],
    ["LB-F2-CB-002", "Minervén"],
    ["LB-F2-MC-004", "Lazio"],
  ]);
  for (const [id, answer] of expectedAnswers) {
    assert.equal(libertadoresPhase2Questions.find((question) => question.id === id)?.correctAnswer, answer);
  }
});

test("both Libertadores phases remain compatible with the World Cup bank", () => {
  const all = [...worldCupPhase1Questions, ...worldCupPhase2Questions, ...worldCupPhase3Questions, ...worldCupPhase4Questions, ...worldCupPhase5Questions, ...libertadoresPhase1Questions, ...libertadoresPhase2Questions];
  assert.equal(all.length, 210);
  assert.equal(new Set(all.map((question) => question.id)).size, 210);
});
test("Libertadores phase 3 bank is valid and uses the balanced draw", () => {
  assert.equal(libertadoresPhase3Questions.length, 30);
  assert.equal(new Set(libertadoresPhase3Questions.map((question) => question.id)).size, 30);
  assert.ok(libertadoresPhase3Questions.every((question) => question.id.startsWith("LB-F3-")));
  assert.ok(libertadoresPhase3Questions.every((question) => question.options.length === 4));
  assert.ok(libertadoresPhase3Questions.every((question) => new Set(question.options).size === 4));
  assert.ok(libertadoresPhase3Questions.every((question) => question.options.every(Boolean)));
  assert.ok(libertadoresPhase3Questions.every((question) => question.options.includes(question.correctAnswer)));
  assert.ok(libertadoresPhase3Questions.every((question) => question.subthemeCode));
  const groups = groupQuestionsBySubtheme(libertadoresPhase3Questions);
  assert.deepEqual(Object.fromEntries(Object.entries(groups).map(([code, items]) => [code, items.length])), { CF: 4, PF: 6, JH: 5, EP: 3, RE: 4, CB: 4, MC: 4 });
  for (const [code, items] of Object.entries(groups)) {
    assert.deepEqual(items.map((question) => question.id), items.map((_, index) => `LB-F3-${code}-${String(index + 1).padStart(3, "0")}`));
  }
  const selected = getRandomQuestionsBySubtheme(libertadoresPhase3Questions, libertadoresPhase3SubthemeDistribution, 10, constantRandom);
  assert.equal(selected.length, 10);
  assert.equal(new Set(selected.map((question) => question.id)).size, 10);
  const counts = selected.reduce<Record<string, number>>((result, question) => {
    result[question.subthemeCode!] = (result[question.subthemeCode!] ?? 0) + 1;
    return result;
  }, {});
  for (const [code, amount] of Object.entries(libertadoresPhase3SubthemeDistribution)) assert.ok((counts[code] ?? 0) >= amount);
});

test("Libertadores phase 3 preserves reviewed and reformulated questions", () => {
  const expectedAnswers = new Map([
    ["LB-F3-CF-003", "Atlético Nacional"],
    ["LB-F3-CF-004", "River Plate"],
    ["LB-F3-PF-001", "Jardel"],
    ["LB-F3-PF-005", "Néstor Ortigoza"],
    ["LB-F3-PF-006", "Roque Júnior"],
    ["LB-F3-JH-005", "Internacional"],
    ["LB-F3-EP-002", "La Paz"],
    ["LB-F3-RE-003", "Cruz Azul"],
    ["LB-F3-RE-004", "Deportivo Italia"],
    ["LB-F3-CB-004", "The Strongest"],
  ]);
  for (const [id, answer] of expectedAnswers) {
    assert.equal(libertadoresPhase3Questions.find((question) => question.id === id)?.correctAnswer, answer);
  }
});

test("three Libertadores phases remain compatible with the World Cup bank", () => {
  const all = [...worldCupPhase1Questions, ...worldCupPhase2Questions, ...worldCupPhase3Questions, ...worldCupPhase4Questions, ...worldCupPhase5Questions, ...libertadoresPhase1Questions, ...libertadoresPhase2Questions, ...libertadoresPhase3Questions];
  assert.equal(all.length, 240);
  assert.equal(new Set(all.map((question) => question.id)).size, 240);
});
test("Libertadores phase 4 bank is valid and uses the balanced draw", () => {
  assert.equal(libertadoresPhase4Questions.length, 30);
  assert.equal(new Set(libertadoresPhase4Questions.map((question) => question.id)).size, 30);
  assert.ok(libertadoresPhase4Questions.every((question) => question.id.startsWith("LB-F4-")));
  assert.ok(libertadoresPhase4Questions.every((question) => question.options.length === 4));
  assert.ok(libertadoresPhase4Questions.every((question) => new Set(question.options).size === 4));
  assert.ok(libertadoresPhase4Questions.every((question) => question.options.every(Boolean)));
  assert.ok(libertadoresPhase4Questions.every((question) => question.options.includes(question.correctAnswer)));
  assert.ok(libertadoresPhase4Questions.every((question) => question.subthemeCode));
  const groups = groupQuestionsBySubtheme(libertadoresPhase4Questions);
  assert.deepEqual(Object.fromEntries(Object.entries(groups).map(([code, items]) => [code, items.length])), { CF: 4, PF: 6, JH: 5, EP: 3, RE: 4, CB: 4, MC: 4 });
  for (const [code, items] of Object.entries(groups)) {
    assert.deepEqual(items.map((question) => question.id), items.map((_, index) => `LB-F4-${code}-${String(index + 1).padStart(3, "0")}`));
  }
  const selected = getRandomQuestionsBySubtheme(libertadoresPhase4Questions, libertadoresPhase4SubthemeDistribution, 10, constantRandom);
  assert.equal(selected.length, 10);
  assert.equal(new Set(selected.map((question) => question.id)).size, 10);
  const counts = selected.reduce<Record<string, number>>((result, question) => {
    result[question.subthemeCode!] = (result[question.subthemeCode!] ?? 0) + 1;
    return result;
  }, {});
  for (const [code, amount] of Object.entries(libertadoresPhase4SubthemeDistribution)) assert.ok((counts[code] ?? 0) >= amount);
});

test("Libertadores phase 4 preserves reviewed and reformulated questions", () => {
  const expectedAnswers = new Map([
    ["LB-F4-PF-005", "Marcelo Grohe"],
    ["LB-F4-JH-001", "Boca Juniors"],
    ["LB-F4-JH-003", "River Plate"],
    ["LB-F4-EP-001", "Maracanã"],
    ["LB-F4-EP-002", "Pascual Guerrero"],
    ["LB-F4-CB-003", "México"],
    ["LB-F4-MC-001", "Ajax"],
    ["LB-F4-MC-002", "Sporting"],
    ["LB-F4-MC-003", "Club Brugge"],
    ["LB-F4-MC-004", "Villarreal"],
    ["LB-F4-RE-004", "América do México"],
  ]);
  for (const [id, answer] of expectedAnswers) {
    assert.equal(libertadoresPhase4Questions.find((question) => question.id === id)?.correctAnswer, answer);
  }
});

test("four Libertadores phases remain compatible with the World Cup bank", () => {
  const all = [...worldCupPhase1Questions, ...worldCupPhase2Questions, ...worldCupPhase3Questions, ...worldCupPhase4Questions, ...worldCupPhase5Questions, ...libertadoresPhase1Questions, ...libertadoresPhase2Questions, ...libertadoresPhase3Questions, ...libertadoresPhase4Questions];
  assert.equal(all.length, 270);
  assert.equal(new Set(all.map((question) => question.id)).size, 270);
});
test("Libertadores phase 5 bank is valid and uses the balanced draw", () => {
  assert.equal(libertadoresPhase5Questions.length, 30);
  assert.equal(new Set(libertadoresPhase5Questions.map((question) => question.id)).size, 30);
  assert.ok(libertadoresPhase5Questions.every((question) => question.id.startsWith("LB-F5-")));
  assert.ok(libertadoresPhase5Questions.every((question) => question.options.length === 4));
  assert.ok(libertadoresPhase5Questions.every((question) => new Set(question.options).size === 4));
  assert.ok(libertadoresPhase5Questions.every((question) => question.options.every(Boolean)));
  assert.ok(libertadoresPhase5Questions.every((question) => question.options.includes(question.correctAnswer)));
  assert.ok(libertadoresPhase5Questions.every((question) => question.subthemeCode));
  const groups = groupQuestionsBySubtheme(libertadoresPhase5Questions);
  assert.deepEqual(Object.fromEntries(Object.entries(groups).map(([code, items]) => [code, items.length])), { CF: 4, PF: 6, JH: 5, EP: 3, RE: 4, CB: 4, MC: 4 });
  for (const [code, items] of Object.entries(groups)) {
    assert.deepEqual(items.map((question) => question.id), items.map((_, index) => "LB-F5-" + code + "-" + String(index + 1).padStart(3, "0")));
  }
  const selected = getRandomQuestionsBySubtheme(libertadoresPhase5Questions, libertadoresPhase5SubthemeDistribution, 10, constantRandom);
  assert.equal(selected.length, 10);
  assert.equal(new Set(selected.map((question) => question.id)).size, 10);
  const counts = selected.reduce<Record<string, number>>((result, question) => {
    result[question.subthemeCode!] = (result[question.subthemeCode!] ?? 0) + 1;
    return result;
  }, {});
  for (const [code, amount] of Object.entries(libertadoresPhase5SubthemeDistribution)) assert.ok((counts[code] ?? 0) >= amount);
});

test("Libertadores phase 5 preserves the reformulated questions", () => {
  const expectedAnswers = new Map([
    ["LB-F5-PF-005", "Thiago Neves"],
    ["LB-F5-RE-002", "Francisco Sá"],
    ["LB-F5-RE-003", "Juan Carlos Sánchez"],
    ["LB-F5-CB-002", "Peru"],
  ]);
  for (const [id, answer] of expectedAnswers) {
    assert.equal(libertadoresPhase5Questions.find((question) => question.id === id)?.correctAnswer, answer);
  }
});

test("five Libertadores phases remain compatible with the World Cup bank", () => {
  const all = [...worldCupPhase1Questions, ...worldCupPhase2Questions, ...worldCupPhase3Questions, ...worldCupPhase4Questions, ...worldCupPhase5Questions, ...libertadoresPhase1Questions, ...libertadoresPhase2Questions, ...libertadoresPhase3Questions, ...libertadoresPhase4Questions, ...libertadoresPhase5Questions];
  assert.equal(all.length, 300);
  assert.equal(new Set(all.map((question) => question.id)).size, 300);
});
const championsLeaguePhases = [
  championsLeaguePhase1Questions,
  championsLeaguePhase2Questions,
  championsLeaguePhase3Questions,
  championsLeaguePhase4Questions,
  championsLeaguePhase5Questions,
];

test("all Champions League phases are valid and use the balanced draw", () => {
  for (const [phaseIndex, phaseQuestions] of championsLeaguePhases.entries()) {
    const phase = phaseIndex + 1;
    assert.equal(phaseQuestions.length, 30);
    assert.equal(new Set(phaseQuestions.map((question) => question.id)).size, 30);
    assert.ok(phaseQuestions.every((question) => question.id.startsWith("CL-F" + phase + "-")));
    assert.ok(phaseQuestions.every((question) => question.topicId === "champions-league" && question.phaseId === phase));
    assert.ok(phaseQuestions.every((question) => question.options.length === 4));
    assert.ok(phaseQuestions.every((question) => new Set(question.options).size === 4));
    assert.ok(phaseQuestions.every((question) => question.options.every(Boolean)));
    assert.ok(phaseQuestions.every((question) => question.options.includes(question.correctAnswer)));
    assert.ok(phaseQuestions.every((question) => question.subthemeCode));
    const groups = groupQuestionsBySubtheme(phaseQuestions);
    assert.deepEqual(Object.fromEntries(Object.entries(groups).map(([code, items]) => [code, items.length])), { CF: 4, PF: 6, JH: 5, EP: 3, RE: 4, CB: 4, MC: 4 });
    for (const [code, items] of Object.entries(groups)) {
      assert.deepEqual(items.map((question) => question.id), items.map((_, index) => "CL-F" + phase + "-" + code + "-" + String(index + 1).padStart(3, "0")));
    }
    const selected = getRandomQuestionsBySubtheme(phaseQuestions, championsLeagueSubthemeDistribution, 10, constantRandom);
    assert.equal(selected.length, 10);
    assert.equal(new Set(selected.map((question) => question.id)).size, 10);
    const counts = selected.reduce<Record<string, number>>((result, question) => {
      result[question.subthemeCode!] = (result[question.subthemeCode!] ?? 0) + 1;
      return result;
    }, {});
    for (const [code, amount] of Object.entries(championsLeagueSubthemeDistribution)) assert.ok((counts[code] ?? 0) >= amount);
  }
});

test("Champions League has 150 unique questions and remains compatible with existing subthemed banks", () => {
  const champions = championsLeaguePhases.flat();
  assert.equal(champions.length, 150);
  assert.equal(new Set(champions.map((question) => question.id)).size, 150);
  const all = [...worldCupPhase1Questions, ...worldCupPhase2Questions, ...worldCupPhase3Questions, ...worldCupPhase4Questions, ...worldCupPhase5Questions, ...libertadoresPhase1Questions, ...libertadoresPhase2Questions, ...libertadoresPhase3Questions, ...libertadoresPhase4Questions, ...libertadoresPhase5Questions, ...champions];
  assert.equal(all.length, 450);
  assert.equal(new Set(all.map((question) => question.id)).size, 450);
});

test("Champions League preserves the three approved reformulations", () => {
  const champions = championsLeaguePhases.flat();
  const expectedAnswers = new Map([
    ["CL-F2-PF-002", "Ronald Koeman"],
    ["CL-F2-CB-001", "Liverpool"],
    ["CL-F5-JH-001", "Panathinaikos"],
  ]);
  for (const [id, answer] of expectedAnswers) {
    assert.equal(champions.find((question) => question.id === id)?.correctAnswer, answer);
  }
});
const brasileiraoPhases = [
  brasileiraoPhase1Questions,
  brasileiraoPhase2Questions,
  brasileiraoPhase3Questions,
  brasileiraoPhase4Questions,
  brasileiraoPhase5Questions,
];

test("all Brasileirao phases are valid and use the balanced draw", () => {
  for (const [phaseIndex, phaseQuestions] of brasileiraoPhases.entries()) {
    const phase = phaseIndex + 1;
    assert.equal(phaseQuestions.length, 30);
    assert.equal(new Set(phaseQuestions.map((question) => question.id)).size, 30);
    assert.ok(phaseQuestions.every((question) => question.id.startsWith("BR-F" + phase + "-")));
    assert.ok(phaseQuestions.every((question) => question.topicId === "brasileirao" && question.phaseId === phase));
    assert.ok(phaseQuestions.every((question) => question.options.length === 4));
    assert.ok(phaseQuestions.every((question) => new Set(question.options).size === 4));
    assert.ok(phaseQuestions.every((question) => question.options.every(Boolean)));
    assert.ok(phaseQuestions.every((question) => question.options.includes(question.correctAnswer)));
    assert.ok(phaseQuestions.every((question) => question.subthemeCode));
    const groups = groupQuestionsBySubtheme(phaseQuestions);
    assert.deepEqual(Object.fromEntries(Object.entries(groups).map(([code, items]) => [code, items.length])), { CF: 4, PF: 6, JH: 5, EP: 3, RE: 4, CB: 4, MC: 4 });
    for (const [code, items] of Object.entries(groups)) {
      assert.deepEqual(items.map((question) => question.id), items.map((_, index) => "BR-F" + phase + "-" + code + "-" + String(index + 1).padStart(3, "0")));
    }
    const selected = getRandomQuestionsBySubtheme(phaseQuestions, brasileiraoSubthemeDistribution, 10, constantRandom);
    assert.equal(selected.length, 10);
    assert.equal(new Set(selected.map((question) => question.id)).size, 10);
    const counts = selected.reduce<Record<string, number>>((result, question) => {
      result[question.subthemeCode!] = (result[question.subthemeCode!] ?? 0) + 1;
      return result;
    }, {});
    for (const [code, amount] of Object.entries(brasileiraoSubthemeDistribution)) assert.ok((counts[code] ?? 0) >= amount);
  }
});

test("Brasileirao has 150 unique questions and remains compatible with all other banks", () => {
  const brasileirao = brasileiraoPhases.flat();
  const champions = championsLeaguePhases.flat();
  assert.equal(brasileirao.length, 150);
  assert.equal(new Set(brasileirao.map((question) => question.id)).size, 150);
  const all = [...worldCupPhase1Questions, ...worldCupPhase2Questions, ...worldCupPhase3Questions, ...worldCupPhase4Questions, ...worldCupPhase5Questions, ...libertadoresPhase1Questions, ...libertadoresPhase2Questions, ...libertadoresPhase3Questions, ...libertadoresPhase4Questions, ...libertadoresPhase5Questions, ...champions, ...brasileirao];
  assert.equal(all.length, 600);
  assert.equal(new Set(all.map((question) => question.id)).size, 600);
});

test("Brasileirao preserves the five approved historical corrections", () => {
  const brasileirao = brasileiraoPhases.flat();
  const expectedAnswers = new Map([
    ["BR-F2-JH-002", "Palmeiras"],
    ["BR-F3-JH-004", "Coritiba"],
    ["BR-F4-PF-002", "Júnior"],
    ["BR-F5-PF-001", "Dirceu Lopes"],
    ["BR-F5-JH-001", "Cruzeiro"],
  ]);
  for (const [id, answer] of expectedAnswers) {
    assert.equal(brasileirao.find((question) => question.id === id)?.correctAnswer, answer);
  }
});