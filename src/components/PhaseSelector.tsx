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
      <div className="mb-4 flex flex-wrap gap-4 text-sm font-bold">
        <button type="button" onClick={onBack} className="text-slate-300 transition hover:text-grass">
          Voltar para temas
        </button>
        <button type="button" onClick={onMainMenu} className="text-slate-300 transition hover:text-grass">
          Menu principal
        </button>
      </div>

      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-grass">{topic.name}</p>
        <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">Escolha a fase</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
          Fases liberadas ficam clicáveis. As demais continuam travadas neste tema.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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
