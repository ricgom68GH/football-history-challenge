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
    <section className="w-full max-w-xl rounded-lg border border-white/10 bg-slate-950/85 p-4 shadow-glow backdrop-blur md:p-5">
      <div className="mb-3 flex items-center justify-between gap-3 text-xs font-bold">
        <div className="flex gap-4">
          <button type="button" onClick={onBackToPhases} className="text-slate-300 transition hover:text-grass">
            Fases
          </button>
          <button type="button" onClick={onMainMenu} className="text-slate-300 transition hover:text-grass">
            Menu principal
          </button>
        </div>
        <span className="rounded-full border border-grass/30 bg-grass/10 px-2.5 py-1 font-black text-grass/90">
          {question.code}
        </span>
      </div>

      <div className="mb-3 space-y-1.5">
        <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-300">
          <span className="truncate">
            {topic.name} • {phase.name}
          </span>
          <span className="shrink-0 text-grass">
            {currentQuestion}/{totalQuestions}
          </span>
        </div>
        <ProgressBar currentQuestion={currentQuestion} totalQuestions={totalQuestions} />
      </div>

      <h2 className="mb-3 text-lg font-black leading-snug text-white md:text-xl">
        {question.question}
      </h2>

      <div className="grid gap-2">
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
        <div className="mt-3 rounded-md border border-white/10 bg-white/5 p-2.5">
          <p className={`text-sm font-black ${gotItRight ? "text-grass" : "text-red-300"}`}>
            {gotItRight ? "Você acertou!" : "Você errou!"}
          </p>
          <p className="mt-1 text-xs text-slate-300">
            Correta: <strong className="text-white">{question.correctAnswer}</strong>
          </p>
          <p className="mt-1.5 text-xs leading-5 text-slate-300">{question.explanation}</p>
        </div>
      )}

      <button
        type="button"
        onClick={onNextQuestion}
        disabled={!showResult}
        className="mt-3 w-full rounded-md bg-grass px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        {currentQuestion === totalQuestions ? "Ver resultado" : "Próxima pergunta"}
      </button>
    </section>
  );
}

