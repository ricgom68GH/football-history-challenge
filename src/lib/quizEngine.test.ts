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
} from "./quizEngine.ts";
import { worldCupPhase1Questions } from "../data/question-bank/world-cup/phase1.ts";
import { worldCupPhase2Questions } from "../data/question-bank/world-cup/phase2.ts";
import { worldCupPhase3Questions } from "../data/question-bank/world-cup/phase3.ts";
import { worldCupPhase4Questions } from "../data/question-bank/world-cup/phase4.ts";
import { worldCupPhase5Questions } from "../data/question-bank/world-cup/phase5.ts";
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