import { SkillComponentId } from "@/constants"
import { ComponentProgress } from "../progression/ComponentProgress"

export type Flashcard = {
    skillComponentId: SkillComponentId
    newFlashcard: boolean
    componentProgress: ComponentProgress
}