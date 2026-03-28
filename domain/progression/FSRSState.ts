export type FSRSCardState = "new" | "learning" | "review" | "relearning"

export type FSRSState = {
  difficulty: number
  stability: number
  scheduledDays: number
  elapsedDays: number
  reps: number
  lapses: number
  state: FSRSCardState
}
