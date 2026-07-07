type ProgressBarProps = {
  currentQuestion: number;
  totalQuestions: number;
};

export function ProgressBar({ currentQuestion, totalQuestions }: ProgressBarProps) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-grass shadow-[0_0_18px_rgba(34,197,94,0.45)] transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
