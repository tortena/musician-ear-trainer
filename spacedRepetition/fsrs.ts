import { QualityScore } from "@/domain/answer/QualityScore"
import { FSRSState } from "@/domain/progression/FSRSState"

const MIN_DIFFICULTY = 1
const MAX_DIFFICULTY = 10
const MIN_STABILITY = 0.5

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getSuccessfulInterval(
  quality: QualityScore,
  current: FSRSState,
  difficulty: number
) {
  if (current.state === "new") {
    if (quality === 3) return 1
    if (quality === 4) return 3
    return 6
  }

  if (current.state === "learning" || current.state === "relearning") {
    if (quality === 3) return 1
    if (quality === 4) return Math.max(2, Math.round(current.stability * 1.5))
    return Math.max(4, Math.round(current.stability * 2.2))
  }

  const qualityFactor = 0.9 + (quality - 3) * 0.17
  const difficultyFactor = 1 + (5.5 - difficulty) * 0.08
  const stabilityFactor = 1.2 + Math.log(current.stability + 1)

  return Math.max(
    current.scheduledDays + 1,
    Math.round(current.stability * qualityFactor * difficultyFactor * stabilityFactor)
  )
}

export function getFSRSValues(fsrsValues: FSRSState, quality: QualityScore): FSRSState {
  const elapsedDays = Math.max(fsrsValues.scheduledDays, 0)
  const reps = fsrsValues.reps + 1
  const difficultyDelta = (3 - quality) * 0.35
  const difficulty = clamp(fsrsValues.difficulty + difficultyDelta, MIN_DIFFICULTY, MAX_DIFFICULTY)

  if (quality < 3) {
    const scheduledDays = quality === 0 ? 0 : 1
    const stability = Math.max(
      MIN_STABILITY,
      fsrsValues.stability * (0.45 + quality * 0.08)
    )

    return {
      difficulty,
      stability,
      scheduledDays,
      elapsedDays,
      reps,
      lapses: fsrsValues.lapses + 1,
      state: fsrsValues.reps === 0 ? "learning" : "relearning",
    }
  }

  const stability =
    fsrsValues.state === "review"
      ? fsrsValues.stability * (1.1 + (quality - 3) * 0.12)
      : Math.max(1.5, fsrsValues.stability + quality * 0.8)

  const scheduledDays = getSuccessfulInterval(quality, fsrsValues, difficulty)

  return {
    difficulty,
    stability: Math.max(MIN_STABILITY, stability),
    scheduledDays,
    elapsedDays,
    reps,
    lapses: fsrsValues.lapses,
    state: scheduledDays >= 2 ? "review" : "learning",
  }
}
