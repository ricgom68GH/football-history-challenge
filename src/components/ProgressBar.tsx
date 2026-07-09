type ProgressBarProps = {
  currentQuestion: number;
  totalQuestions: number;
};

export function ProgressBar({ currentQuestion, totalQuestions }: ProgressBarProps) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 shadow-inner">
      <div
        className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-lime-400 shadow-[0_0_16px_rgba(34,197,94,0.35)] transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}