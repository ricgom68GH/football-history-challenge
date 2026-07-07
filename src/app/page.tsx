"use client";

import { useEffect, useMemo, useState } from "react";
import { PhaseSelector } from "@/components/PhaseSelector";
import { QuizCard } from "@/components/QuizCard";
import { ResultCard } from "@/components/ResultCard";
import { TopicSelector } from "@/components/TopicSelector";
import { phases } from "@/data/phases";
import { questions } from "@/data/questions";
import { topics } from "@/data/topics";
import { loadProgress, unlockNextPhase } from "@/lib/progress";
import { didPassPhase, getQuestionsByTopicAndPhase } from "@/lib/quizEngine";
import type { Phase, QuizProgress, Topic } from "@/types/quiz";

type GameStatus = "start" | "topics" | "phases" | "playing" | "finished";

export default function Home() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("start");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [progress, setProgress] = useState<QuizProgress>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [passedLastQuiz, setPassedLastQuiz] = useState(false);

  useEffect(() => {
    setProgress(loadProgress(topics.map((topic) => topic.id)));
  }, []);

  const phaseQuestions = useMemo(() => {
    if (!selectedTopic || !selectedPhase) {
      return [];
    }

    return getQuestionsByTopicAndPhase(questions, selectedTopic.id, selectedPhase.id);
  }, [selectedPhase, selectedTopic]);

  const currentQuestion = phaseQuestions[currentQuestionIndex];
  const currentQuestionNumber = currentQuestionIndex + 1;

  function goToMainMenu() {
    setSelectedTopic(null);
    setSelectedPhase(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setPassedLastQuiz(false);
    setGameStatus("start");
  }

  function startJourney() {
    setGameStatus("topics");
  }

  function selectTopic(topic: Topic) {
    setSelectedTopic(topic);
    setSelectedPhase(null);
    setGameStatus("phases");
  }

  function selectPhase(phase: Phase) {
    if (!selectedTopic) {
      return;
    }

    const unlockedPhase = progress[selectedTopic.id] ?? 1;
    const hasFullQuestionSet =
      getQuestionsByTopicAndPhase(questions, selectedTopic.id, phase.id).length >= 10;

    if (phase.id > unlockedPhase || !hasFullQuestionSet) {
      return;
    }

    setSelectedPhase(phase);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setPassedLastQuiz(false);
    setGameStatus("playing");
  }

  function selectAnswer(answer: string) {
    if (showResult || !currentQuestion) {
      return;
    }

    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === currentQuestion.correctAnswer) {
      setScore((currentScore) => currentScore + 1);
    }
  }

  function goToNextQuestion() {
    if (!selectedTopic || !selectedPhase) {
      return;
    }

    const isLastQuestion = currentQuestionIndex === phaseQuestions.length - 1;

    if (isLastQuestion) {
      const finalScore = score + (selectedAnswer === currentQuestion?.correctAnswer ? 0 : 0);
      const passed = didPassPhase(finalScore, selectedPhase);

      setPassedLastQuiz(passed);

      if (passed) {
        setProgress((currentProgress) =>
          unlockNextPhase(currentProgress, selectedTopic.id, selectedPhase.id, phases.length),
        );
      }

      setGameStatus("finished");
      return;
    }

    setCurrentQuestionIndex((currentIndex) => currentIndex + 1);
    setSelectedAnswer(null);
    setShowResult(false);
  }

  function restartPhase() {
    if (!selectedPhase) {
      return;
    }

    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setPassedLastQuiz(false);
    setGameStatus("playing");
  }

  function backToPhases() {
    setSelectedPhase(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setGameStatus("phases");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-pitch px-4 py-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.22),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(7,19,13,0.95))]" />
      <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="relative z-10 flex min-h-[calc(100vh-2rem)] w-full items-center justify-center">
        {gameStatus === "start" && (
          <section className="w-full max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-grass">
              Futebol histórico
            </p>
            <h1 className="mt-5 text-5xl font-black text-white md:text-7xl">GR Games Quiz</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              Escolha um tema, avance pelas fases e prove que sua memória de futebol é de campeão.
            </p>
            <button
              type="button"
              onClick={startJourney}
              className="mt-10 rounded-lg bg-grass px-8 py-4 text-lg font-bold text-slate-950 shadow-glow transition hover:bg-green-400"
            >
              Começar Jornada
            </button>
          </section>
        )}

        {gameStatus === "topics" && (
          <TopicSelector topics={topics} onSelectTopic={selectTopic} onBack={goToMainMenu} />
        )}

        {gameStatus === "phases" && selectedTopic && (
          <PhaseSelector
            topic={selectedTopic}
            phases={phases}
            questions={questions}
            unlockedPhase={progress[selectedTopic.id] ?? 1}
            onSelectPhase={selectPhase}
            onBack={() => setGameStatus("topics")}
            onMainMenu={goToMainMenu}
          />
        )}

        {gameStatus === "playing" && selectedTopic && selectedPhase && currentQuestion && (
          <QuizCard
            topic={selectedTopic}
            phase={selectedPhase}
            question={currentQuestion}
            currentQuestion={currentQuestionNumber}
            totalQuestions={phaseQuestions.length}
            selectedAnswer={selectedAnswer}
            showResult={showResult}
            onSelectAnswer={selectAnswer}
            onNextQuestion={goToNextQuestion}
            onBackToPhases={backToPhases}
            onMainMenu={goToMainMenu}
          />
        )}

        {gameStatus === "finished" && selectedTopic && selectedPhase && (
          <ResultCard
            topic={selectedTopic}
            phase={selectedPhase}
            score={score}
            totalQuestions={phaseQuestions.length}
            passed={passedLastQuiz}
            isLastPhase={selectedPhase.id === phases.length}
            onPlayAgain={restartPhase}
            onBackToPhases={backToPhases}
            onMainMenu={goToMainMenu}
          />
        )}
      </div>
    </main>
  );
}

