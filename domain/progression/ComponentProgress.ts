import { SkillComponentId } from "@/constants"
import { FSRSState } from "./FSRSState"

export type ComponentProgress = {
    skillComponentId: SkillComponentId
    fsrsValues: FSRSState
    dueDate: string
    lastReviewed: string
    componentXp: number
}
