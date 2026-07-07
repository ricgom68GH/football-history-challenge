import { TopicCard } from "@/components/TopicCard";
import type { Topic } from "@/types/quiz";

type TopicSelectorProps = {
  topics: Topic[];
  onSelectTopic: (topic: Topic) => void;
  onBack: () => void;
};

export function TopicSelector({ topics, onSelectTopic, onBack }: TopicSelectorProps) {
  return (
    <section className="w-full max-w-5xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 text-sm font-bold text-slate-300 transition hover:text-grass"
      >
        Voltar ao menu principal
      </button>

      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-grass">Escolha o tema</p>
        <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">Sua jornada histórica</h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          Cada tema tem sua própria progressão. Avançar em um tema não libera fases nos outros.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} onSelect={onSelectTopic} />
        ))}
      </div>
    </section>
  );
}
