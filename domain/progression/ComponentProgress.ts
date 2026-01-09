import { SkillComponentId } from "@/constants"
import { SM2Values } from "../answer/SM2Response"

export type ComponentProgress = {
    skillComponentId: SkillComponentId
    sm2Values: SM2Values
    dueDate: string
    lastReviewed: string
    componentXp: number
}