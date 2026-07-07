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
      className="flex min-h-[108px] flex-col items-center justify-center rounded-lg border border-white/10 bg-slate-950/80 p-3 text-center shadow-glow transition hover:-translate-y-0.5 hover:border-grass hover:bg-slate-900 sm:min-h-32 sm:p-4"
    >
      <span className="text-[24px] leading-none sm:text-2xl" aria-hidden="true">
        {topic.icon}
      </span>
      <h3 className="mt-1.5 text-sm font-black leading-tight text-white sm:mt-2 sm:text-lg">{topic.name}</h3>
      <p className="mx-auto mt-1 line-clamp-2 max-w-40 text-[11px] leading-4 text-slate-300 sm:mt-1.5 sm:max-w-56 sm:text-sm sm:leading-5">
        {topic.description}
      </p>
    </button>
  );
}

