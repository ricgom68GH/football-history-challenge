type ResultCardProps = {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
};

export function ResultCard({ score, totalQuestions, onRestart }: ResultCardProps) {
  const points = score * 100;
  const percentage = (score / totalQuestions) * 100;

  let message = "Boa! Você conhece o jogo, mas ainda pode subir de nivel.";

  if (percentage >= 80) {
    message = "Craque! Seu conhecimento de futebol está em alto nível.";
  } else if (percentage < 50) {
    message = "Hora de treinar mais um pouco e tentar de novo.";
  }

  return (
    <section className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-950/80 p-6 text-center shadow-glow backdrop-blur md:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-grass">Resultado final</p>
      <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">{points} pontos</h2>
      <p className="mt-4 text-lg text-slate-200">
        Você acertou <strong className="text-grass">{score}</strong> de{" "}
        <strong>{totalQuestions}</strong> perguntas.
      </p>
      <p className="mx-auto mt-4 max-w-md text-slate-300">{message}</p>

      <button
        type="button"
        onClick={onRestart}
        className="mt-8 rounded-lg bg-grass px-6 py-3 font-bold text-slate-950 transition hover:bg-green-400"
      >
        Jogar novamente
      </button>
    </section>
  );
}

