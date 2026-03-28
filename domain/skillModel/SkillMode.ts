export type Stage = {
    globalXpRequirement: number
    previousStageXpRequirement: number
    skillNodeIds: string[]
}

export type SkillMode = {
    id: string
    title: string
    levelRequirement: number
    skillType: string
    stages: Stage[]
}
