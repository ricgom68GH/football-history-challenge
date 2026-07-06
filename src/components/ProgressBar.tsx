type ProgressBarProps = {
  currentQuestion: number;
  totalQuestions: number;
};

export function ProgressBar({ currentQuestion, totalQuestions }: ProgressBarProps) {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-grass transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
