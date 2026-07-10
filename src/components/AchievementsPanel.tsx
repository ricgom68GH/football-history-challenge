"use client";

import { useEffect, useState } from "react";
import { ACHIEVEMENTS, loadAchievementState, type AchievementState } from "@/lib/achievements";

export function AchievementsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [achievementState, setAchievementState] = useState<AchievementState>(() => ({
    unlockedAchievementIds: [],
    playedTopicIds: [],
    passedPhaseKeys: [],
    bestMedalsByPhase: {},
  }));

  useEffect(() => {
    setAchievementState(loadAchievementState());
  }, [isOpen]);

  const unlockedIds = new Set(achievementState.unlockedAchievementIds);
  const unlockedCount = achievementState.unlockedAchievementIds.length;

  return (
    <div className="mx-auto mb-1.5 w-full max-w-xl sm:mb-2.5">
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="mx-auto flex items-center justify-center rounded-full bg-white/88 px-3.5 py-1 text-[11px] font-black text-emerald-900 shadow-sm transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-white/70 sm:px-4 sm:py-1.5 sm:text-xs"
      >
        Conquistas {unlockedCount}/{ACHIEVEMENTS.length}
      </button>

      {isOpen && (
        <div className="mt-1.5 rounded-[1rem] border border-white/70 bg-white/90 p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.14)] backdrop-blur sm:mt-2 sm:rounded-[1.25rem] sm:p-2">
          <div className="grid max-h-[205px] grid-cols-2 gap-1 overflow-y-auto pr-1 sm:max-h-[260px] sm:gap-1.5">
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedIds.has(achievement.id);

              return (
                <div
                  key={achievement.id}
                  className={`flex min-w-0 items-start gap-1.5 rounded-xl border px-2 py-1.5 text-left ${
                    isUnlocked
                      ? "border-emerald-200 bg-emerald-50 text-slate-900"
                      : "border-slate-200 bg-slate-100/80 text-slate-500 grayscale"
                  }`}
                >
                  <span className="text-base leading-none" aria-hidden="true">
                    {achievement.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-black leading-4 sm:text-xs">{achievement.name}</p>
                    <p className="mt-0.5 line-clamp-2 text-[10px] font-semibold leading-3 sm:text-[11px] sm:leading-4">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}