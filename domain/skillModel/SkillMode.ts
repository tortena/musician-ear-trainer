import { SkillNodeId, SkillTypeId } from '@/constants'

export type Stage = {
    xpRequirement: number
    skillNodeIds: SkillNodeId[]
}

export type SkillMode = {
    id: string
    title: string
    levelRequirement: number
    skillType: SkillTypeId
    stages: Stage[]
}