import type { Phase, Topic } from "@/types/quiz";
import { getPoints } from "@/lib/quizEngine";

type ResultCardProps = {
  topic: Topic;
  phase: Phase;
  score: number;
  totalQuestions: number;
  passed: boolean;
  isLastPhase: boolean;
  onPlayAgain: () => void;
  onBackToPhases: () => void;
  onMainMenu: () => void;
};

export function ResultCard({
  topic,
  phase,
  score,
  totalQuestions,
  passed,
  isLastPhase,
  onPlayAgain,
  onBackToPhases,
  onMainMenu,
}: ResultCardProps) {
  const points = getPoints(score);
  const message = passed
    ? isLastPhase
      ? "Jornada concluída. Você virou lenda neste tema."
      : "Nova fase desbloqueada neste tema."
    : "Meta não alcançada. Tente novamente.";

  return (
    <section className="w-full max-w-xl rounded-lg border border-white/10 bg-slate-950/85 p-5 text-center shadow-glow backdrop-blur md:p-6">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-grass">Resultado</p>
      <h2 className="mt-3 text-4xl font-black text-white md:text-5xl">{points}</h2>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">pontos</p>

      <p className="mt-3 text-sm font-bold text-slate-300">
        {topic.name} • {phase.name}
      </p>
      <p className="mt-3 text-base text-slate-200">
        <strong className="text-grass">{score}</strong> de <strong>{totalQuestions}</strong> acertos
      </p>
      <p className="mt-1 text-xs text-slate-300">
        Meta: <strong className="text-white">{phase.requiredScore}</strong> acertos
      </p>
      <p className={`mx-auto mt-3 max-w-md text-sm font-black ${passed ? "text-grass" : "text-red-300"}`}>
        {message}
      </p>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={onMainMenu}
          className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:border-grass hover:bg-grass/10"
        >
          Menu
        </button>
        <button
          type="button"
          onClick={onBackToPhases}
          className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:border-grass hover:bg-grass/10"
        >
          Fases
        </button>
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded-md bg-grass px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-green-400"
        >
          Tentar novamente
        </button>
      </div>
    </section>
  );
}
