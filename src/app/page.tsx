"use client";

import { useState } from "react";
import { QuizCard } from "@/components/QuizCard";
import { ResultCard } from "@/components/ResultCard";
import { questions } from "@/data/questions";

type GameStatus = "start" | "playing" | "finished";

export default function Home() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("start");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const currentQuestionNumber = currentQuestionIndex + 1;

  function startQuiz() {
    setGameStatus("playing");
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  }

  function selectAnswer(answer: string) {
    if (showResult) {
      return;
    }

    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === currentQuestion.correctAnswer) {
      setScore((currentScore) => currentScore + 1);
    }
  }

  function goToNextQuestion() {
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (isLastQuestion) {
      setGameStatus("finished");
      return;
    }

    setCurrentQuestionIndex((currentIndex) => currentIndex + 1);
    setSelectedAnswer(null);
    setShowResult(false);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-pitch px-4 py-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.22),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(7,19,13,0.95))]" />
      <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="relative z-10 flex w-full justify-center">
        {gameStatus === "start" && (
          <section className="w-full max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-grass">
              Futebol quiz
            </p>
            <h1 className="mt-5 text-5xl font-black text-white md:text-7xl">GR Games Quiz</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              Teste seu conhecimento sobre futebol, avance de fase e prove que você entende do
              jogo.
            </p>
            <button
              type="button"
              onClick={startQuiz}
              className="mt-10 rounded-lg bg-grass px-8 py-4 text-lg font-bold text-slate-950 shadow-glow transition hover:bg-green-400"
            >
              Começar Quiz
            </button>
          </section>
        )}

        {gameStatus === "playing" && (
          <QuizCard
            question={currentQuestion}
            currentQuestion={currentQuestionNumber}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswer}
            showResult={showResult}
            onSelectAnswer={selectAnswer}
            onNextQuestion={goToNextQuestion}
          />
        )}

        {gameStatus === "finished" && (
          <ResultCard score={score} totalQuestions={questions.length} onRestart={startQuiz} />
        )}
      </div>
    </main>
  );
}


