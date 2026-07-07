import { TopicCard } from "@/components/TopicCard";
import type { Topic } from "@/types/quiz";

type TopicSelectorProps = {
  topics: Topic[];
  onSelectTopic: (topic: Topic) => void;
  onBack: () => void;
};

export function TopicSelector({ topics, onSelectTopic, onBack }: TopicSelectorProps) {
  return (
    <section className="w-full max-w-3xl">
      <div className="mb-2 flex justify-center sm:mb-4">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-slate-300 transition hover:text-grass"
        >
          Menu principal
        </button>
      </div>

      <div className="mb-3 text-center sm:mb-5">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-grass">Escolha o tema</p>
        <h2 className="mt-1 text-2xl font-black text-white sm:mt-2 sm:text-3xl md:text-4xl">Jornada histórica</h2>
        <p className="mx-auto mt-1 max-w-lg text-xs leading-5 text-slate-300 sm:mt-2 sm:text-sm sm:leading-6">
          Selecione uma competição e avance por fases próprias daquele tema.
        </p>
      </div>

      <div className="mx-auto grid max-w-2xl grid-cols-2 gap-2 sm:gap-3">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} onSelect={onSelectTopic} />
        ))}
      </div>
    </section>
  );
}

