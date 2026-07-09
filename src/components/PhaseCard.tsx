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
      className={`group relative overflow-hidden rounded-[1.05rem] border bg-white/94 px-2.5 py-2 text-left shadow-[0_9px_20px_rgba(15,23,42,0.14)] transition enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_16px_34px_rgba(15,23,42,0.22)] disabled:cursor-not-allowed sm:min-h-[132px] sm:rounded-[1.35rem] sm:p-3.5 ${
        canPlay
          ? "border-white/80"
          : "border-white/55 bg-slate-100/90 opacity-70 grayscale"
      }`}
    >
      <div className={`absolute inset-y-0 left-0 w-1.5 sm:inset-x-0 sm:top-0 sm:h-2 sm:w-auto ${canPlay ? "bg-gradient-to-b from-emerald-600 to-lime-400 sm:bg-gradient-to-r" : "bg-slate-300"}`} />

      <div className="flex items-center justify-between gap-2 pl-1 sm:items-start sm:pl-0">
        <div className="flex min-w-0 items-center gap-2 sm:block">
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide sm:inline-block sm:px-2.5 sm:py-1 sm:text-[10px] ${
              canPlay ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
            }`}
          >
            Fase {phase.id}
          </span>
          <h3 className="min-w-0 truncate text-sm font-black leading-tight text-slate-950 sm:mt-3 sm:text-lg">
            {phase.name}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide sm:px-2.5 sm:py-1 sm:text-[10px] ${
            canPlay ? "bg-lime-100 text-emerald-800" : "bg-slate-100 text-slate-600"
          }`}
        >
          {status}
        </span>
      </div>

      <p className="mt-1 pl-1 text-[11px] font-black leading-4 text-slate-700 sm:mt-3 sm:pl-0 sm:text-xs">
        Meta {phase.requiredScore}/10 <span className="text-slate-400">·</span> {questionCount} perguntas
      </p>
    </button>
  );
}