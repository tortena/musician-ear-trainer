import { SkillComponentId } from "@/constants"
import { ComponentProgress } from "@/domain/progression/ComponentProgress"
import { UserProgress } from "@/domain/progression/UserProgress"
import { StorageKey, loadData, saveData } from "./storage"

function createInitialComponentProgress(
    skillComponentId: SkillComponentId
): ComponentProgress {
    const now = new Date().toISOString()
    
    
    return {
        skillComponentId: skillComponentId,
        sm2Values: {
            repetitions: 0,
            interval: 0,
            easeFactor: 2.5
        },
        dueDate: now,
        lastReviewed: now,
        componentXp: 0
    }
}

export function createInitialUserProgress(): UserProgress {
    const today = new Date().toISOString().slice(0,10)

    return {
        componentProgresses: {},

        progression: {
            xp: 0,
            level: 1
        },

        engagement: {
            currentStreak: 0,
            longestStreak: 0,
            lastActiveDate: today
        }
    }
}
/*
export async function loadUserProgress(): Promise<UserProgress> {
  const stored = await loadData<UserProgress>(StorageKey.USER_PROGRESS);
  return stored ?? createInitialUserProgress();
}
*/

export async function loadUserProgress(): Promise<UserProgress> {
  return createInitialUserProgress()
}

export async function saveUserProgress(progress: UserProgress): Promise<void> {
  await saveData(StorageKey.USER_PROGRESS, progress);
}


export function getOrCreateComponentProgress(
  progress: UserProgress,
  skillComponentId: SkillComponentId
): ComponentProgress {
  if (!progress.componentProgresses[skillComponentId]) {
    progress.componentProgresses[skillComponentId] =
      createInitialComponentProgress(skillComponentId);
  }

  return progress.componentProgresses[skillComponentId];
}