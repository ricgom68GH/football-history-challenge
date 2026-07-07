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
    <section className="w-full max-w-4xl">
      <div className="mb-1 flex justify-center gap-4 text-[11px] font-bold sm:mb-4 sm:gap-5 sm:text-xs">
        <button type="button" onClick={onBack} className="text-slate-300 transition hover:text-grass">
          Temas
        </button>
        <button type="button" onClick={onMainMenu} className="text-slate-300 transition hover:text-grass">
          Menu principal
        </button>
      </div>

      <div className="mb-2 text-center sm:mb-5">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-grass">{topic.name}</p>
        <h2 className="mt-0.5 text-xl font-black text-white sm:mt-2 sm:text-3xl md:text-4xl">Escolha a fase</h2>
        <p className="mx-auto mt-1 hidden max-w-lg text-xs leading-5 text-slate-300 sm:block sm:mt-2 sm:text-sm sm:leading-6">
          Avance pelas fases do tema.
        </p>
      </div>

      <div className="mx-auto grid max-w-3xl gap-1.5 sm:max-w-4xl sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
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


