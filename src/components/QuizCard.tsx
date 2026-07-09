import { AnswerButton } from "@/components/AnswerButton";
import { ProgressBar } from "@/components/ProgressBar";
import type { Phase, Question, Topic } from "@/types/quiz";

type QuizCardProps = {
  topic: Topic;
  phase: Phase;
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  showResult: boolean;
  onSelectAnswer: (answer: string) => void;
  onNextQuestion: () => void;
  onBackToPhases: () => void;
  onMainMenu: () => void;
};

export function QuizCard({
  topic,
  phase,
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  showResult,
  onSelectAnswer,
  onNextQuestion,
  onBackToPhases,
  onMainMenu,
}: QuizCardProps) {
  const gotItRight = selectedAnswer === question.correctAnswer;

  return (
    <section className="w-full max-w-xl rounded-[1.35rem] border border-white/75 bg-white/90 p-2.5 shadow-[0_18px_48px_rgba(15,23,42,0.2)] backdrop-blur sm:rounded-[1.75rem] sm:p-4">
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-black sm:mb-2 sm:gap-2 sm:text-xs">
        <div className="flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onBackToPhases}
            className="rounded-full bg-slate-200 px-2.5 py-1 text-slate-700 transition hover:bg-emerald-100 hover:text-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100 sm:px-3 sm:py-1.5"
          >
            Fases
          </button>
          <button
            type="button"
            onClick={onMainMenu}
            className="rounded-full bg-slate-200 px-2.5 py-1 text-slate-700 transition hover:bg-emerald-100 hover:text-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-100 sm:px-3 sm:py-1.5"
          >
            Menu
          </button>
        </div>
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-black text-emerald-800 sm:px-3 sm:py-1.5">
          {question.code}
        </span>
      </div>

      <div className="mb-2 rounded-[1rem] bg-slate-100 p-2 sm:mb-3 sm:rounded-[1.25rem] sm:p-3">
        <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px] font-black text-slate-700 sm:mb-2 sm:text-xs">
          <span className="min-w-0 truncate">
            {topic.name} / {phase.name}
          </span>
          <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-emerald-800 shadow-sm sm:px-3 sm:py-1">
            {currentQuestion}/{totalQuestions}
          </span>
        </div>
        <ProgressBar currentQuestion={currentQuestion} totalQuestions={totalQuestions} />
      </div>

      <h2 className="mb-2 text-base font-black leading-snug text-slate-950 sm:mb-3 sm:text-xl">
        {question.question}
      </h2>

      <div className="grid gap-1.5 sm:gap-2">
        {question.options.map((answer) => (
          <AnswerButton
            key={answer}
            answer={answer}
            isSelected={selectedAnswer === answer}
            isCorrect={showResult && answer === question.correctAnswer}
            showResult={showResult}
            onClick={() => onSelectAnswer(answer)}
          />
        ))}
      </div>

      {showResult && (
        <div className={`mt-2 rounded-[1rem] border p-2 sm:mt-3 sm:rounded-[1.25rem] sm:p-3 ${gotItRight ? "border-emerald-300 bg-emerald-50" : "border-red-300 bg-red-50"}`}>
          <p className={`text-xs font-black sm:text-sm ${gotItRight ? "text-emerald-800" : "text-red-800"}`}>
            {gotItRight ? "Voc\u00ea acertou!" : "Voc\u00ea errou!"}
          </p>
          <p className="mt-0.5 text-[11px] font-semibold text-slate-700 sm:mt-1 sm:text-sm">
            Correta: <strong className="text-slate-950">{question.correctAnswer}</strong>
          </p>
          <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-700 sm:line-clamp-3 sm:text-sm sm:leading-5">{question.explanation}</p>
        </div>
      )}

      <button
        type="button"
        onClick={onNextQuestion}
        disabled={!showResult}
        className="mt-2 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-lime-400 px-4 py-2.5 text-sm font-black text-slate-950 shadow-[0_12px_24px_rgba(22,163,74,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(22,163,74,0.42)] focus:outline-none focus:ring-4 focus:ring-lime-200 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-600 disabled:shadow-none disabled:hover:translate-y-0 sm:mt-3 sm:px-5 sm:py-3 sm:text-base"
      >
        {currentQuestion === totalQuestions ? "Ver resultado" : "Pr\u00f3xima pergunta"}
      </button>
    </section>
  );
}