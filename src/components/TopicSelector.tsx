import { TopicCard } from "@/components/TopicCard";
import type { Topic } from "@/types/quiz";

type TopicSelectorProps = {
  topics: Topic[];
  onSelectTopic: (topic: Topic) => void;
  onBack: () => void;
};

export function TopicSelector({ topics, onSelectTopic, onBack }: TopicSelectorProps) {
  return (
    <section className="w-full max-w-5xl py-1 sm:py-3">
      <div className="mb-1.5 flex justify-center sm:mb-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full bg-white/85 px-3.5 py-1 text-[11px] font-black text-slate-700 shadow-sm transition hover:bg-white hover:text-emerald-800 focus:outline-none focus:ring-4 focus:ring-white/70 sm:px-4 sm:py-1.5 sm:text-xs"
        >
          Menu principal
        </button>
      </div>

      <div className="mx-auto mb-2 max-w-xl rounded-[1.25rem] border border-white/70 bg-white/84 px-4 py-2.5 text-center shadow-[0_14px_34px_rgba(15,23,42,0.15)] backdrop-blur sm:mb-3 sm:rounded-[1.5rem] sm:px-7 sm:py-4">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-800 sm:text-[10px]">Escolha o tema</p>
        <h2 className="mt-0.5 text-xl font-black leading-tight text-slate-950 sm:mt-1 sm:text-3xl">{"Jornada hist\u00f3rica"}</h2>
        <p className="mx-auto mt-0.5 hidden max-w-md text-sm font-semibold leading-5 text-slate-700 sm:block">
          {"Escolha uma competi\u00e7\u00e3o e avance pelas fases."}
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} onSelect={onSelectTopic} />
        ))}
      </div>
    </section>
  );
}