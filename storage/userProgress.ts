import { SkillComponentId } from "@/constants"
import { ComponentProgress } from "@/domain/progression/ComponentProgress"
import { FSRSCardState, FSRSState } from "@/domain/progression/FSRSState"
import { UserProgress } from "@/domain/progression/UserProgress"
import { StorageKey, loadData, saveData } from "./storage"

function createInitialFSRSState(): FSRSState {
    return {
        difficulty: 5,
        stability: 0.5,
        scheduledDays: 0,
        elapsedDays: 0,
        reps: 0,
        lapses: 0,
        state: "new"
    }
}

function createInitialComponentProgress(
    skillComponentId: SkillComponentId
): ComponentProgress {
    const now = new Date().toISOString()
    
    
    return {
        skillComponentId: skillComponentId,
        fsrsValues: createInitialFSRSState(),
        dueDate: now,
        lastReviewed: now,
        componentXp: 0
    }
}

function clampDifficulty(value: number) {
    return Math.min(Math.max(value, 1), 10)
}

function isFSRSCardState(value: unknown): value is FSRSCardState {
    return value === "new" || value === "learning" || value === "review" || value === "relearning"
}

function migrateFSRSValues(componentProgress: Record<string, unknown>): FSRSState {
    const fsrsValues = componentProgress.fsrsValues

    if (fsrsValues && typeof fsrsValues === "object") {
        const source = fsrsValues as Partial<FSRSState>

        return {
            difficulty: typeof source.difficulty === "number" ? source.difficulty : 5,
            stability: typeof source.stability === "number" ? source.stability : 0.5,
            scheduledDays: typeof source.scheduledDays === "number" ? source.scheduledDays : 0,
            elapsedDays: typeof source.elapsedDays === "number" ? source.elapsedDays : 0,
            reps: typeof source.reps === "number" ? source.reps : 0,
            lapses: typeof source.lapses === "number" ? source.lapses : 0,
            state: isFSRSCardState(source.state) ? source.state : "new",
        }
    }

    const sm2Values = componentProgress.sm2Values as
        | { repetitions?: number; interval?: number; easeFactor?: number }
        | undefined

    if (!sm2Values) {
        return createInitialFSRSState()
    }

    const reps = typeof sm2Values.repetitions === "number" ? sm2Values.repetitions : 0
    const scheduledDays = typeof sm2Values.interval === "number" ? sm2Values.interval : 0
    const easeFactor = typeof sm2Values.easeFactor === "number" ? sm2Values.easeFactor : 2.5

    return {
        difficulty: clampDifficulty(7 - easeFactor * 2),
        stability: Math.max(0.5, scheduledDays || 0.5),
        scheduledDays,
        elapsedDays: scheduledDays,
        reps,
        lapses: 0,
        state: reps >= 2 ? "review" : reps >= 1 ? "learning" : "new",
    }
}

function normalizeUserProgress(progress: UserProgress | null): UserProgress {
    const initial = createInitialUserProgress()

    if (!progress) {
        return initial
    }

    const componentProgresses = Object.fromEntries(
        Object.entries(progress.componentProgresses ?? {}).map(([skillComponentId, componentProgress]) => {
            if (!componentProgress) {
                return [skillComponentId, undefined]
            }

            const raw = componentProgress as unknown as Record<string, unknown>

            return [skillComponentId, {
                skillComponentId,
                fsrsValues: migrateFSRSValues(raw),
                dueDate: typeof raw.dueDate === "string" ? raw.dueDate : new Date().toISOString(),
                lastReviewed: typeof raw.lastReviewed === "string" ? raw.lastReviewed : new Date().toISOString(),
                componentXp: typeof raw.componentXp === "number" ? raw.componentXp : 0,
            }]
        })
    ) as UserProgress["componentProgresses"]

    return {
        componentProgresses,
        progression: {
            xp: progress.progression?.xp ?? initial.progression.xp,
            level: progress.progression?.level ?? initial.progression.level
        },
        engagement: {
            currentStreak: progress.engagement?.currentStreak ?? initial.engagement.currentStreak,
            longestStreak: progress.engagement?.longestStreak ?? initial.engagement.longestStreak,
            lastActiveDate: progress.engagement?.lastActiveDate ?? initial.engagement.lastActiveDate
        }
    }
}

function createInitialUserProgress(): UserProgress {
    return {
        componentProgresses: {},

        progression: {
            xp: 0,
            level: 1
        },

        engagement: {
            currentStreak: 0,
            longestStreak: 0,
            lastActiveDate: null
        }
    }
}

export async function loadUserProgress(): Promise<UserProgress> {
  const stored = await loadData<UserProgress>(StorageKey.USER_PROGRESS);
  return normalizeUserProgress(stored ?? null);
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
