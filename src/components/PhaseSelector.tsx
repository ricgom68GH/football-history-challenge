import { PhaseCard } from "@/components/PhaseCard";
import type { Phase, Question, Topic } from "@/types/quiz";

type PhaseSelectorProps = {
  topic: Topic;
  phases: Phase[];
  questions: Question[];
  unlockedPhase: number;
  onSelectPhase: (phase: Phase) => void;
  onBack: () => void;
  onMainMenu: () => void;
};

export function PhaseSelector({
  topic,
  phases,
  questions,
  unlockedPhase,
  onSelectPhase,
  onBack,
  onMainMenu,
}: PhaseSelectorProps) {
  return (
    <section className="w-full max-w-5xl py-1 sm:py-3">
      <div className="mb-1.5 flex justify-center gap-2 text-[11px] font-black sm:mb-3 sm:text-xs">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full bg-white/85 px-3.5 py-1 text-slate-700 shadow-sm transition hover:bg-white hover:text-emerald-800 focus:outline-none focus:ring-4 focus:ring-white/70 sm:px-4 sm:py-1.5"
        >
          Temas
        </button>
        <button
          type="button"
          onClick={onMainMenu}
          className="rounded-full bg-white/85 px-3.5 py-1 text-slate-700 shadow-sm transition hover:bg-white hover:text-emerald-800 focus:outline-none focus:ring-4 focus:ring-white/70 sm:px-4 sm:py-1.5"
        >
          Menu principal
        </button>
      </div>

      <div className="mx-auto mb-2 max-w-xl rounded-[1.25rem] border border-white/70 bg-white/84 px-4 py-2.5 text-center shadow-[0_14px_34px_rgba(15,23,42,0.15)] backdrop-blur sm:mb-3 sm:rounded-[1.5rem] sm:px-7 sm:py-4">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-800 sm:text-[10px]">{topic.name}</p>
        <h2 className="mt-0.5 text-xl font-black leading-tight text-slate-950 sm:mt-1 sm:text-3xl">Escolha a fase</h2>
        <p className="mx-auto mt-0.5 hidden max-w-md text-sm font-semibold leading-5 text-slate-700 sm:block">
          Avance pelas fases do tema.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-1.5 sm:grid-cols-2 sm:gap-2.5 xl:grid-cols-3">
        {phases.map((phase) => {
          const questionCount = questions.filter(
            (question) => question.topicId === topic.id && question.phaseId === phase.id,
          ).length;

          return (
            <PhaseCard
              key={phase.id}
              phase={phase}
              isUnlocked={phase.id <= unlockedPhase}
              questionCount={questionCount}
              onSelect={onSelectPhase}
            />
          );
        })}
      </div>
    </section>
  );
}