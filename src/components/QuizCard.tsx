import { AnswerButton } from "@/components/AnswerButton";
import { ProgressBar } from "@/components/ProgressBar";
import type { Question } from "@/types/quiz";

type QuizCardProps = {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  showResult: boolean;
  onSelectAnswer: (answer: string) => void;
  onNextQuestion: () => void;
};

export function QuizCard({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  showResult,
  onSelectAnswer,
  onNextQuestion,
}: QuizCardProps) {
  const gotItRight = selectedAnswer === question.correctAnswer;

  return (
    <section className="w-full max-w-2xl rounded-xl border border-white/10 bg-slate-950/80 p-5 shadow-glow backdrop-blur md:p-6">
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between gap-4 text-sm font-semibold text-slate-300">
          <span>
            Pergunta {currentQuestion} de {totalQuestions}
          </span>
          <span>{Math.round((currentQuestion / totalQuestions) * 100)}%</span>
        </div>
        <ProgressBar currentQuestion={currentQuestion} totalQuestions={totalQuestions} />
      </div>

      <h2 className="mb-4 text-xl font-bold leading-tight text-white md:text-2xl">
        {question.question}
      </h2>

      <div className="grid gap-2.5">
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
        <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
          <p className={`font-bold ${gotItRight ? "text-grass" : "text-red-300"}`}>
            {gotItRight ? "Você acertou!" : "Você errou!"}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            Resposta correta: <strong className="text-white">{question.correctAnswer}</strong>
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onNextQuestion}
        disabled={!showResult}
        className="mt-4 w-full rounded-lg bg-grass px-5 py-2.5 font-bold text-slate-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        {currentQuestion === totalQuestions ? "Ver resultado" : "Próxima pergunta"}
      </button>
    </section>
  );
}


