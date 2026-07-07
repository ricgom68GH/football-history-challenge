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
      ? "Você concluiu esta jornada e virou lenda neste tema."
      : "Você avançou e liberou a próxima fase deste tema."
    : "Você ainda não bateu a meta. Revise a história e tente de novo.";

  return (
    <section className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-950/80 p-6 text-center shadow-glow backdrop-blur md:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-grass">Resultado final</p>
      <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">{points} pontos</h2>
      <p className="mt-3 text-sm font-bold text-slate-300">
        {topic.name} • {phase.name}
      </p>
      <p className="mt-4 text-lg text-slate-200">
        Você acertou <strong className="text-grass">{score}</strong> de{" "}
        <strong>{totalQuestions}</strong> perguntas.
      </p>
      <p className="mt-2 text-sm text-slate-300">
        Meta da fase: <strong className="text-white">{phase.requiredScore} acertos</strong>
      </p>
      <p className={`mx-auto mt-4 max-w-md font-semibold ${passed ? "text-grass" : "text-red-300"}`}>
        {message}
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={onMainMenu}
          className="rounded-lg border border-white/10 bg-white/5 px-5 py-3 font-bold text-white transition hover:border-grass hover:bg-grass/10"
        >
          Menu principal
        </button>
        <button
          type="button"
          onClick={onBackToPhases}
          className="rounded-lg border border-white/10 bg-white/5 px-5 py-3 font-bold text-white transition hover:border-grass hover:bg-grass/10"
        >
          Ver fases
        </button>
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded-lg bg-grass px-5 py-3 font-bold text-slate-950 transition hover:bg-green-400"
        >
          Jogar novamente
        </button>
      </div>
    </section>
  );
}
