import { SkillComponentId } from "@/constants";
import { ComponentProgress } from "./ComponentProgress";

export type UserProgress = {
  componentProgresses: Partial<Record<SkillComponentId, ComponentProgress>>;

  progression: {
    xp: number;
    level: number;
  };

  engagement: {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string;
  };
};