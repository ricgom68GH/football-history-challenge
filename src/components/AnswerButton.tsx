type AnswerButtonProps = {
  answer: string;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
  onClick: () => void;
};

export function AnswerButton({
  answer,
  isSelected,
  isCorrect,
  showResult,
  onClick,
}: AnswerButtonProps) {
  const resultStyle = isCorrect
    ? "border-grass bg-grass/20 text-white"
    : isSelected
      ? "border-red-400 bg-red-500/20 text-white"
      : "border-white/10 bg-white/5 text-slate-200";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={showResult}
      className={`w-full rounded-md border px-3 py-2 text-left text-sm font-semibold transition hover:border-grass hover:bg-grass/10 disabled:cursor-not-allowed ${resultStyle}`}
    >
      {answer}
    </button>
  );
}
