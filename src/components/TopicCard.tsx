import type { Topic } from "@/types/quiz";

type TopicCardProps = {
  topic: Topic;
  onSelect: (topic: Topic) => void;
};

export function TopicCard({ topic, onSelect }: TopicCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(topic)}
      className="min-h-32 rounded-lg border border-white/10 bg-slate-950/80 p-4 text-center shadow-glow transition hover:-translate-y-0.5 hover:border-grass hover:bg-slate-900"
    >
      <span className="text-2xl" aria-hidden="true">
        {topic.icon}
      </span>
      <h3 className="mt-2 text-lg font-black text-white">{topic.name}</h3>
      <p className="mx-auto mt-1.5 line-clamp-2 max-w-56 text-sm leading-5 text-slate-300">
        {topic.description}
      </p>
    </button>
  );
}
