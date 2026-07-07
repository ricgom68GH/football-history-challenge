import type { Phase } from "@/types/quiz";

type PhaseCardProps = {
  phase: Phase;
  isUnlocked: boolean;
  questionCount: number;
  onSelect: (phase: Phase) => void;
};

export function PhaseCard({ phase, isUnlocked, questionCount, onSelect }: PhaseCardProps) {
  const hasFullQuestionSet = questionCount >= 10;
  const canPlay = isUnlocked && hasFullQuestionSet;
  const status = canPlay ? "Liberada" : "Travada";

  return (
    <button
      type="button"
      onClick={() => onSelect(phase)}
      disabled={!canPlay}
      className={`rounded-lg border px-2.5 py-2 text-left shadow-glow transition enabled:hover:-translate-y-0.5 enabled:hover:border-grass enabled:hover:bg-slate-900 disabled:cursor-not-allowed sm:min-h-32 sm:p-3.5 ${
        canPlay
          ? "border-grass/60 bg-slate-950/85"
          : "border-white/10 bg-slate-950/50 opacity-55"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black sm:px-2.5 sm:py-1 sm:text-xs ${
              canPlay ? "bg-grass/15 text-grass" : "bg-white/10 text-slate-400"
            }`}
          >
            Fase {phase.id}
          </span>
          <h3 className="truncate text-sm font-black leading-tight text-white sm:text-base">
            {phase.name}
          </h3>
        </div>

        <span className={`shrink-0 text-[10px] font-bold sm:text-xs ${canPlay ? "text-grass" : "text-slate-400"}`}>
          {status}
        </span>
      </div>

      <p className="mt-1 text-[11px] font-bold leading-4 text-slate-300 sm:mt-2 sm:text-xs">
        Meta {phase.requiredScore}/10 <span className="text-slate-500">·</span> {questionCount} perguntas
      </p>
    </button>
  );
}
