"use client";

import { useState } from "react";
import type { Phase, Topic } from "@/types/quiz";

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

const PUBLIC_URL = "https://football-history-challenge.vercel.app";

function getPerformanceLabel(score: number) {
  if (score === 10) {
    return "Lenda do Futebol";
  }

  if (score >= 8) {
    return "Craque da Hist\u00f3ria";
  }

  if (score >= 6) {
    return "Torcedor Raiz";
  }

  if (score >= 4) {
    return "Conhecedor da Arquibancada";
  }

  return "Torcedor em Aquecimento";
}

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
  const [shareMessage, setShareMessage] = useState("");
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const performanceLabel = getPerformanceLabel(score);
  const perfectScore = score === totalQuestions;
  const heroIcon = perfectScore ? "\u2b50\ud83c\udfc6" : passed ? "\ud83c\udfc6" : "\u26bd";
  const statusText = passed ? "Voc\u00ea passou de fase!" : "Voc\u00ea ainda n\u00e3o passou.";
  const motivation = perfectScore
    ? "Perfeito! Voc\u00ea gabaritou a fase e entrou no modo lenda."
    : passed
      ? isLastPhase
        ? "Voc\u00ea concluiu a jornada deste tema e mostrou repert\u00f3rio de campe\u00e3o."
        : "Voc\u00ea avan\u00e7ou! Mostrou que conhece os grandes momentos do futebol."
      : "Voc\u00ea ficou perto. Tente novamente e busque a classifica\u00e7\u00e3o.";

  const shareText = `Fiz ${score}/${totalQuestions} no Football History Challenge!\nTema: ${topic.name}\nFase: ${phase.name}\n\nVoc\u00ea consegue passar dessa fase?\n${PUBLIC_URL}`;

  async function shareResult() {
    setShareMessage("");

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Football History Challenge",
          text: shareText,
          url: PUBLIC_URL,
        });
        return;
      }

      await navigator.clipboard.writeText(shareText);
      setShareMessage("Resultado copiado!");
    } catch {
      setShareMessage("N\u00e3o foi poss\u00edvel copiar o resultado.");
    }
  }

  return (
    <section className="w-full max-w-xl rounded-[1.5rem] border border-white/75 bg-white/92 p-3.5 text-center shadow-[0_20px_58px_rgba(15,23,42,0.2)] backdrop-blur sm:rounded-[1.85rem] sm:p-5">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-300 text-2xl shadow-[0_12px_24px_rgba(22,163,74,0.26)] sm:h-14 sm:w-14 sm:text-3xl" aria-hidden="true">
        {heroIcon}
      </div>

      <p className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-800 sm:text-xs">
        Resultado
      </p>
      <h2 className="mt-1 text-5xl font-black leading-none text-slate-950 sm:text-6xl">
        {score}<span className="text-2xl text-slate-500 sm:text-3xl">/{totalQuestions}</span>
      </h2>
      <p className="mt-1 text-sm font-black text-slate-700 sm:text-base">
        {percentage}% de aproveitamento
      </p>

      <div className={`mx-auto mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-wide sm:text-sm ${passed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
        {statusText}
      </div>

      <div className="mx-auto mt-2 rounded-2xl bg-slate-100 px-4 py-2">
        <p className="text-sm font-black text-slate-950 sm:text-base">{performanceLabel}</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-700 sm:text-sm">{motivation}</p>
      </div>

      <div className="mt-3 grid gap-1.5 rounded-2xl border border-slate-200 bg-white/80 p-2 text-left text-xs font-bold text-slate-700 sm:grid-cols-2 sm:gap-2 sm:p-3 sm:text-sm">
        <p><span className="font-black text-slate-950">Tema:</span> {topic.name}</p>
        <p><span className="font-black text-slate-950">Fase:</span> {phase.name}</p>
        <p><span className="font-black text-slate-950">Meta:</span> {phase.requiredScore}/{totalQuestions}</p>
        <p><span className="font-black text-slate-950">Resultado:</span> {score}/{totalQuestions}</p>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded-2xl bg-gradient-to-r from-emerald-600 to-lime-400 px-4 py-2.5 text-sm font-black text-slate-950 shadow-[0_12px_24px_rgba(22,163,74,0.3)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-lime-200 sm:py-3"
        >
          Tentar novamente
        </button>
        <button
          type="button"
          onClick={shareResult}
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-black text-emerald-900 transition hover:-translate-y-0.5 hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-100 sm:py-3"
        >
          Compartilhar resultado
        </button>
        <button
          type="button"
          onClick={onBackToPhases}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-800 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-100 sm:py-3"
        >
          Escolher fases
        </button>
        <button
          type="button"
          onClick={onMainMenu}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-800 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-100 sm:py-3"
        >
          Menu principal
        </button>
      </div>

      {shareMessage && (
        <p className="mt-2 text-xs font-black text-slate-700" role="status">
          {shareMessage}
        </p>
      )}
    </section>
  );
}