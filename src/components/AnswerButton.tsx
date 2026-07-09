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
    ? "border-emerald-500 bg-emerald-100 text-emerald-950 shadow-[0_8px_20px_rgba(16,185,129,0.18)]"
    : isSelected
      ? "border-red-400 bg-red-100 text-red-950 shadow-[0_8px_20px_rgba(248,113,113,0.16)]"
      : "border-slate-300 bg-white text-slate-900 shadow-[0_7px_18px_rgba(15,23,42,0.08)]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={showResult}
      className={`w-full rounded-xl border px-3 py-2 text-left text-xs font-black leading-4 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm sm:leading-5 ${resultStyle}`}
    >
      {answer}
    </button>
  );
}