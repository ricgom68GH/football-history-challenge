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
      <div className="mb-4 flex justify-center">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-slate-300 transition hover:text-grass"
        >
          Menu principal
        </button>
      </div>

      <div className="mb-5 text-center">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-grass">Escolha o tema</p>
        <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">Jornada histórica</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-300">
          Selecione uma competição e avance por fases próprias daquele tema.
        </p>
      </div>

      <div className="mx-auto grid max-w-2xl gap-3 sm:grid-cols-2">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} onSelect={onSelectTopic} />
        ))}
      </div>
    </section>
  );
}
