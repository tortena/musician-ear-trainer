import { SkillNodeId } from './SkillNode'
import { SkillTypeId } from './SkillType'

export type SkillModeId = string

type Stage = {
    xpRequirement: number
    skillNodeId: SkillNodeId[]
}

export type SkillMode = {
    id: SkillModeId
    title: string
    levelRequirement: number
    skillType: SkillTypeId
}