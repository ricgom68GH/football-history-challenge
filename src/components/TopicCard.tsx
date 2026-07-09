import type { Topic } from "@/types/quiz";

type TopicCardProps = {
  topic: Topic;
  onSelect: (topic: Topic) => void;
};

const topicStyles: Record<Topic["id"], { accent: string; badge: string; icon: string; description: string }> = {
  "world-cup": {
    accent: "from-sky-600 to-blue-800",
    badge: "bg-sky-100 text-sky-800",
    icon: "\ud83c\udfc6",
    description: "Copas, finais e craques.",
  },
  libertadores: {
    accent: "from-red-600 to-amber-400",
    badge: "bg-red-100 text-red-800",
    icon: "\ud83d\udd25",
    description: "Gl\u00f3rias da Am\u00e9rica do Sul.",
  },
  "champions-league": {
    accent: "from-indigo-700 to-sky-600",
    badge: "bg-indigo-100 text-indigo-800",
    icon: "\u2b50",
    description: "Noites europeias hist\u00f3ricas.",
  },
  brasileirao: {
    accent: "from-emerald-600 to-yellow-400",
    badge: "bg-emerald-100 text-emerald-800",
    icon: "\u26bd",
    description: "T\u00edtulos, clubes e \u00eddolos.",
  },
};

export function TopicCard({ topic, onSelect }: TopicCardProps) {
  const style = topicStyles[topic.id];

  return (
    <button
      type="button"
      onClick={() => onSelect(topic)}
      className="group relative min-h-[82px] overflow-hidden rounded-[1.15rem] border border-white/80 bg-white/94 p-2 text-left shadow-[0_10px_22px_rgba(15,23,42,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.22)] focus:outline-none focus:ring-4 focus:ring-white/80 sm:min-h-[138px] sm:rounded-[1.35rem] sm:p-4"
    >
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r sm:h-2 ${style.accent}`} />
      <div className="flex items-start justify-between gap-1.5 pt-0.5 sm:gap-2 sm:pt-0">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${style.badge} text-xl shadow-inner sm:h-12 sm:w-12 sm:rounded-2xl sm:text-3xl`}
          aria-hidden="true"
        >
          {style.icon}
        </span>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-slate-700 sm:px-2.5 sm:py-1 sm:text-[10px]">
          5 fases
        </span>
      </div>

      <div className="mt-1.5 sm:mt-3">
        <h3 className="text-sm font-black leading-tight text-slate-950 sm:text-xl">{topic.name}</h3>
        <p className="mt-1 hidden text-sm font-bold leading-5 text-slate-700 sm:block">
          {style.description}
        </p>
      </div>

      <div className="mt-2 hidden items-center text-sm font-black text-emerald-800 sm:flex">
        Jogar agora
        <span className="ml-1.5 transition group-hover:translate-x-1" aria-hidden="true">
          -&gt;
        </span>
      </div>
    </button>
  );
}