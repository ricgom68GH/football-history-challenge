"use client";

import { useState } from "react";
import { getRoundMedal, type Achievement } from "@/lib/achievements";
import type { Phase, Topic } from "@/types/quiz";

type ResultCardProps = {
  topic: Topic;
  phase: Phase;
  score: number;
  totalQuestions: number;
  passed: boolean;
  isLastPhase: boolean;
  newAchievements: Achievement[];
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
  newAchievements,
  onPlayAgain,
  onBackToPhases,
  onMainMenu,
}: ResultCardProps) {
  const [shareMessage, setShareMessage] = useState("");
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const performanceLabel = getPerformanceLabel(score);
  const medal = getRoundMedal(score, totalQuestions);
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
  const shareResultLine = medal.isMedal
    ? `Medalha: ${medal.name} ${medal.icon}`
    : `Resultado: ${medal.label} ${medal.icon}`;
  const shareText = `Fiz ${score}/${totalQuestions} no Football History Challenge!\n${shareResultLine}\n\nTema: ${topic.name}\nFase: ${phase.name}\n\nVoc\u00ea consegue passar dessa fase?\n${PUBLIC_URL}`;

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
    <section className="w-full max-w-xl rounded-[1.35rem] border border-white/75 bg-white/92 p-2.5 text-center shadow-[0_18px_48px_rgba(15,23,42,0.19)] backdrop-blur sm:rounded-[1.75rem] sm:p-4">
      <div className="flex items-center justify-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-lime-300 text-xl shadow-[0_10px_20px_rgba(22,163,74,0.24)] sm:h-11 sm:w-11 sm:text-2xl" aria-hidden="true">
          {heroIcon}
        </div>
        <div className="text-left">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-800 sm:text-[10px]">
            Resultado
          </p>
          <p className="text-xs font-black text-slate-700 sm:text-sm">{percentage}% de aproveitamento</p>
        </div>
      </div>

      <h2 className="mt-1 text-4xl font-black leading-none text-slate-950 sm:text-5xl">
        {score}<span className="text-xl text-slate-500 sm:text-2xl">/{totalQuestions}</span>
      </h2>

      <div className="mx-auto mt-1.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 sm:mt-2 sm:px-3 sm:py-2">
        <p className="text-sm font-black leading-5 text-emerald-950 sm:text-base">
          <span aria-hidden="true">{medal.icon}</span> {medal.label}
        </p>
        <p className="text-[11px] font-semibold leading-4 text-emerald-800 sm:text-xs">
          {medal.message}
        </p>
      </div>

      <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5 sm:mt-2">
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide sm:text-xs ${passed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
          {statusText}
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-800 sm:text-xs">
          {performanceLabel}
        </span>
      </div>

      <p className="mx-auto mt-1.5 max-w-md text-[11px] font-semibold leading-4 text-slate-700 sm:mt-2 sm:text-xs sm:leading-5">
        {motivation}
      </p>

      {newAchievements.length > 0 && (
        <div className="mt-2 rounded-2xl border border-amber-200 bg-amber-50 p-1.5 text-left sm:p-2">
          <p className="px-1 text-[10px] font-black uppercase tracking-wide text-amber-800 sm:text-xs">
            {newAchievements.length === 1 ? "Nova conquista desbloqueada!" : "Novas conquistas desbloqueadas!"}
          </p>
          <div className="mt-1 grid grid-cols-2 gap-1 sm:gap-1.5">
            {newAchievements.map((achievement) => (
              <div key={achievement.id} className="flex min-w-0 items-center gap-1.5 rounded-xl bg-white/75 px-2 py-1">
                <span className="text-sm" aria-hidden="true">{achievement.icon}</span>
                <span className="truncate text-[11px] font-black text-slate-900 sm:text-xs">{achievement.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 rounded-2xl border border-slate-200 bg-white/80 p-2 text-left text-[11px] font-bold leading-4 text-slate-700 sm:text-xs">
        <p><span className="font-black text-slate-950">Tema:</span> {topic.name}</p>
        <p><span className="font-black text-slate-950">Fase:</span> {phase.name}</p>
        <p><span className="font-black text-slate-950">Meta:</span> {phase.requiredScore}/{totalQuestions}</p>
        <p><span className="font-black text-slate-950">Resultado:</span> {score}/{totalQuestions}</p>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded-2xl bg-gradient-to-r from-emerald-600 to-lime-400 px-3 py-2 text-xs font-black text-slate-950 shadow-[0_10px_20px_rgba(22,163,74,0.28)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-lime-200 sm:py-2.5 sm:text-sm"
        >
          Tentar novamente
        </button>
        <button
          type="button"
          onClick={shareResult}
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-900 transition hover:-translate-y-0.5 hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-100 sm:py-2.5 sm:text-sm"
        >
          Compartilhar
        </button>
        <button
          type="button"
          onClick={onBackToPhases}
          className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-800 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-100 sm:py-2.5 sm:text-sm"
        >
          Escolher fases
        </button>
        <button
          type="button"
          onClick={onMainMenu}
          className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-800 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-100 sm:py-2.5 sm:text-sm"
        >
          Menu principal
        </button>
      </div>

      {shareMessage && (
        <p className="mt-1.5 text-xs font-black text-slate-700" role="status">
          {shareMessage}
        </p>
      )}
    </section>
  );
}