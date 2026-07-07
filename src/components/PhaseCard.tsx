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
      className={`min-h-36 rounded-lg border p-3.5 text-left shadow-glow transition enabled:hover:-translate-y-0.5 enabled:hover:border-grass enabled:hover:bg-slate-900 disabled:cursor-not-allowed ${
        canPlay
          ? "border-grass/60 bg-slate-950/85"
          : "border-white/10 bg-slate-950/50 opacity-55"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-black ${
            canPlay ? "bg-grass/15 text-grass" : "bg-white/10 text-slate-400"
          }`}
        >
          Fase {phase.id}
        </span>
        <span className={`text-xs font-bold ${canPlay ? "text-grass" : "text-slate-400"}`}>
          {status}
        </span>
      </div>

      <h3 className="mt-3 text-base font-black text-white">{phase.name}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-300">{phase.description}</p>

      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-300">
        <span className="rounded-full bg-white/10 px-2.5 py-1">Meta {phase.requiredScore}/10</span>
        <span className="rounded-full bg-white/10 px-2.5 py-1">{questionCount}/10</span>
      </div>
    </button>
  );
}
