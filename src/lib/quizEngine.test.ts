import assert from "node:assert/strict";
import test from "node:test";
import {
  fillRemainingQuestions,
  getRandomQuestionsBySubtheme,
  groupQuestionsBySubtheme,
  worldCupPhase1SubthemeDistribution,
} from "./quizEngine.ts";
import { worldCupPhase1Questions } from "../data/question-bank/world-cup/phase1.ts";
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
