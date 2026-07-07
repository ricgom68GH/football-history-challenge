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
      <div className="mb-4 flex justify-center gap-5 text-xs font-bold">
        <button type="button" onClick={onBack} className="text-slate-300 transition hover:text-grass">
          Temas
        </button>
        <button type="button" onClick={onMainMenu} className="text-slate-300 transition hover:text-grass">
          Menu principal
        </button>
      </div>

      <div className="mb-5 text-center">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-grass">{topic.name}</p>
        <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">Escolha a fase</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-300">
          Fases liberadas ficam em destaque. As travadas aguardam sua campanha.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
