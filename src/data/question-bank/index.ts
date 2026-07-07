import type { Question } from "@/types/quiz";
import { worldCupPhase1Questions } from "./world-cup/phase1";
import { worldCupPhase2Questions } from "./world-cup/phase2";
import { worldCupPhase3Questions } from "./world-cup/phase3";
import { worldCupPhase4Questions } from "./world-cup/phase4";
import { worldCupPhase5Questions } from "./world-cup/phase5";
import { libertadoresPhase1Questions } from "./libertadores/phase1";
import { libertadoresPhase2Questions } from "./libertadores/phase2";
import { libertadoresPhase3Questions } from "./libertadores/phase3";
import { libertadoresPhase4Questions } from "./libertadores/phase4";
import { libertadoresPhase5Questions } from "./libertadores/phase5";
import { championsLeaguePhase1Questions } from "./champions-league/phase1";
import { championsLeaguePhase2Questions } from "./champions-league/phase2";
import { championsLeaguePhase3Questions } from "./champions-league/phase3";
import { championsLeaguePhase4Questions } from "./champions-league/phase4";
import { championsLeaguePhase5Questions } from "./champions-league/phase5";
import { brasileiraoPhase1Questions } from "./brasileirao/phase1";
import { brasileiraoPhase2Questions } from "./brasileirao/phase2";
import { brasileiraoPhase3Questions } from "./brasileirao/phase3";
import { brasileiraoPhase4Questions } from "./brasileirao/phase4";
import { brasileiraoPhase5Questions } from "./brasileirao/phase5";

export const questions: Question[] = [
  ...worldCupPhase1Questions,
  ...worldCupPhase2Questions,
  ...worldCupPhase3Questions,
  ...worldCupPhase4Questions,
  ...worldCupPhase5Questions,
  ...libertadoresPhase1Questions,
  ...libertadoresPhase2Questions,
  ...libertadoresPhase3Questions,
  ...libertadoresPhase4Questions,
  ...libertadoresPhase5Questions,
  ...championsLeaguePhase1Questions,
  ...championsLeaguePhase2Questions,
  ...championsLeaguePhase3Questions,
  ...championsLeaguePhase4Questions,
  ...championsLeaguePhase5Questions,
  ...brasileiraoPhase1Questions,
  ...brasileiraoPhase2Questions,
  ...brasileiraoPhase3Questions,
  ...brasileiraoPhase4Questions,
  ...brasileiraoPhase5Questions,
];
