"use client";

import { useEffect, useRef, useState } from "react";
import { PhaseSelector } from "@/components/PhaseSelector";
import { PrivateDuelPlaceholder } from "@/components/PrivateDuelPlaceholder";
import { QuizCard } from "@/components/QuizCard";
import { ResultCard } from "@/components/ResultCard";
import { TopicSelector } from "@/components/TopicSelector";
import { phases } from "@/data/phases";
import { questions } from "@/data/questions";
import { topics } from "@/data/topics";
import { completeQuizRound, type Achievement } from "@/lib/achievements";
import { QUESTION_TIME_SECONDS } from "@/lib/gameConfig";
import { loadProgress, unlockNextPhase } from "@/lib/progress";
import { didPassPhase, getQuestionsByTopicAndPhase, getRandomQuestionsForPhase } from "@/lib/quizEngine";
import type { GameMode, Phase, Question, QuizProgress, Topic } from "@/types/quiz";

type GameStatus = "start" | "duel" | "topics" | "phases" | "playing" | "finished";

export default function Home() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("start");
  const [gameMode, setGameMode] = useState<GameMode>("solo");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [progress, setProgress] = useState<QuizProgress>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [passedLastQuiz, setPassedLastQuiz] = useState(false);
  const [phaseQuestions, setPhaseQuestions] = useState<Question[]>([]);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(QUESTION_TIME_SECONDS);
  const [timeExpired, setTimeExpired] = useState(false);
  const answerLockedRef = useRef(false);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerHandlerRef = useRef<(answer: string | null, timedOut?: boolean) => void>(() => {});

  useEffect(() => {
    setProgress(loadProgress(topics.map((topic) => topic.id)));
  }, []);

  const currentQuestion = phaseQuestions[currentQuestionIndex];
  const currentQuestionNumber = currentQuestionIndex + 1;
  function clearQuestionTimer() {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (timerTimeoutRef.current) {
      clearTimeout(timerTimeoutRef.current);
      timerTimeoutRef.current = null;
    }
  }

  useEffect(() => {
    if (gameMode !== "solo" || gameStatus !== "playing" || !currentQuestion) {
      clearQuestionTimer();
      return;
    }

    clearQuestionTimer();
    answerLockedRef.current = false;
    setTimeRemaining(QUESTION_TIME_SECONDS);
    setTimeExpired(false);

    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining((currentTime) => Math.max(0, currentTime - 1));
    }, 1000);
    timerTimeoutRef.current = setTimeout(() => {
      setTimeRemaining(0);
      answerHandlerRef.current(null, true);
    }, QUESTION_TIME_SECONDS * 1000);

    return clearQuestionTimer;
  }, [currentQuestion?.id, gameMode, gameStatus]);

  function goToMainMenu() {
    clearQuestionTimer();
    setGameMode("solo");
    setTimeRemaining(QUESTION_TIME_SECONDS);
    setTimeExpired(false);
    setSelectedTopic(null);
    setSelectedPhase(null);
    setPhaseQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setPassedLastQuiz(false);
    setGameStatus("start");
  }

  function startSoloGame() {
    setGameMode("solo");
    setGameStatus("topics");
  }

  function openPrivateDuel() {
    setGameMode("private_duel");
    setGameStatus("duel");
  }

  function selectTopic(topic: Topic) {
    setSelectedTopic(topic);
    setSelectedPhase(null);
    setPhaseQuestions([]);
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
    setPhaseQuestions(getRandomQuestionsForPhase(questions, selectedTopic.id, phase.id));
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setPassedLastQuiz(false);
    setGameStatus("playing");
  }

  function selectAnswer(answer: string | null, timedOut = false) {
    if (showResult || answerLockedRef.current || !currentQuestion) {
      return;
    }

    answerLockedRef.current = true;
    clearQuestionTimer();
    setSelectedAnswer(answer);
    setTimeExpired(timedOut);
    setShowResult(true);

    if (answer === currentQuestion.correctAnswer) {
      setScore((currentScore) => currentScore + 1);
    }
  }

  answerHandlerRef.current = selectAnswer;

  function goToNextQuestion() {
    if (!selectedTopic || !selectedPhase) {
      return;
    }

    const isLastQuestion = currentQuestionIndex === phaseQuestions.length - 1;

    if (isLastQuestion) {
      const finalScore = score + (selectedAnswer === currentQuestion?.correctAnswer ? 0 : 0);
      const passed = didPassPhase(finalScore, selectedPhase);

      setPassedLastQuiz(passed);
      const completedRound = completeQuizRound({
        topicId: selectedTopic.id,
        phaseId: selectedPhase.id,
        score: finalScore,
        totalQuestions: phaseQuestions.length,
        passed,
      });
      setNewAchievements(completedRound.newAchievements);

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
    if (!selectedTopic || !selectedPhase) {
      return;
    }

    setPhaseQuestions(getRandomQuestionsForPhase(questions, selectedTopic.id, selectedPhase.id));
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setPassedLastQuiz(false);
    setGameStatus("playing");
  }

  function backToPhases() {
    setSelectedPhase(null);
    setPhaseQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setGameStatus("phases");
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#dff7ee] px-3 py-2 text-slate-900 sm:px-4 sm:py-3">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(247,255,178,0.54),rgba(204,245,132,0.22)_32%,transparent_58%),linear-gradient(115deg,#d8fb9a_0%,#a7e873_28%,#70cd67_58%,#31a95c_100%)]" />
      <div className="absolute inset-0 opacity-35 bg-[repeating-linear-gradient(102deg,rgba(255,255,255,0.18)_0,rgba(255,255,255,0.18)_92px,rgba(18,122,57,0.16)_92px,rgba(18,122,57,0.16)_184px)]" />
      <div className="absolute inset-0 opacity-25 bg-[linear-gradient(90deg,transparent_calc(50%-1px),rgba(255,255,255,0.58)_50%,transparent_calc(50%+1px)),radial-gradient(circle_at_center,transparent_0,transparent_18%,rgba(255,255,255,0.42)_18.2%,transparent_18.6%)]" />
      <div className="absolute -left-10 top-[18%] h-56 w-32 rounded-r-[3rem] border-y-2 border-r-2 border-white/28 sm:h-72 sm:w-44" />
      <div className="absolute -right-10 bottom-[18%] h-56 w-32 rounded-l-[3rem] border-y-2 border-l-2 border-white/28 sm:h-72 sm:w-44" />
      <div className="absolute left-6 top-8 text-2xl opacity-24 sm:left-16 sm:top-14 sm:text-3xl" aria-hidden="true">{"\ud83c\udfc6"}</div>
      <div className="absolute right-8 top-10 text-2xl opacity-22 sm:right-20 sm:top-16 sm:text-3xl" aria-hidden="true">{"\u2b50"}</div>
      <div className="absolute bottom-9 left-8 text-2xl opacity-24 sm:bottom-14 sm:left-20 sm:text-3xl" aria-hidden="true">{"\u26bd"}</div>
      <div className="absolute bottom-8 right-10 text-2xl opacity-22 sm:bottom-16 sm:right-24 sm:text-3xl" aria-hidden="true">{"\ud83c\udff3\ufe0f"}</div>
      <div className="absolute left-[10%] top-[18%] h-px w-28 rotate-[-12deg] border-t border-dashed border-white/30" />
      <div className="absolute bottom-[12%] right-[9%] h-px w-32 rotate-[-10deg] border-t border-dashed border-white/30" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-1rem)] w-full max-w-6xl items-start justify-center py-1 sm:items-center sm:py-0">
        {gameStatus === "start" && (
          <section className="w-full max-w-lg rounded-[1.75rem] border border-white/75 bg-white/88 px-5 py-6 text-center shadow-[0_20px_58px_rgba(15,23,42,0.2)] backdrop-blur sm:px-8 sm:py-7 md:py-8">
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-[#05231f] shadow-[0_12px_26px_rgba(14,165,233,0.24)] ring-1 ring-emerald-200/70 sm:h-24 sm:w-24">
              <img
                src="/brand/gr-games-logo.png"
                alt="GR Games"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-800">
              {"FOOTBALL HISTORY \u00b7 GR GAMES"}
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl md:text-5xl">Football History Challenge</h1>
            <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-slate-700 sm:text-base">
              {"Teste seu conhecimento sobre Copas, Libertadores, Champions e Brasileir\u00e3o."}
            </p>
            <div className="mx-auto mt-4 flex max-w-sm flex-wrap items-center justify-center gap-2" aria-hidden="true">
              <span className="rounded-full bg-sky-100 px-3 py-1.5 text-lg shadow-sm">{"\u26bd"}</span>
              <span className="rounded-full bg-amber-100 px-3 py-1.5 text-lg shadow-sm">{"\ud83c\udfc6"}</span>
              <span className="rounded-full bg-indigo-100 px-3 py-1.5 text-lg shadow-sm">{"\u2b50"}</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-lg shadow-sm">{"\ud83c\udff3\ufe0f"}</span>
            </div>
            <button
              type="button"
              onClick={startSoloGame}
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-lime-400 px-7 py-3.5 text-base font-black text-slate-950 shadow-[0_14px_28px_rgba(22,163,74,0.36)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(22,163,74,0.44)] focus:outline-none focus:ring-4 focus:ring-lime-200 sm:w-auto"
            >
              Jogar sozinho
            </button>
            <button
              type="button"
              onClick={openPrivateDuel}
              className="mt-3 w-full rounded-2xl border border-sky-200 bg-sky-50 px-7 py-3.5 text-base font-black text-sky-900 transition hover:-translate-y-0.5 hover:bg-sky-100 focus:outline-none focus:ring-4 focus:ring-sky-100 sm:ml-2 sm:w-auto"
            >
              Desafiar um amigo
            </button>
          </section>
        )}

        {gameStatus === "duel" && (
          <PrivateDuelPlaceholder onBack={goToMainMenu} />
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
            timeRemaining={timeRemaining}
            timeExpired={timeExpired}
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
            newAchievements={newAchievements}
            onPlayAgain={restartPhase}
            onBackToPhases={backToPhases}
            onMainMenu={goToMainMenu}
          />
        )}
      </div>
    </main>
  );
}