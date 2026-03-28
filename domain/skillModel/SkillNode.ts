export type SkillNode = {
    id: string
    title: string
    description?: string
    skillMode: string
    nodeType: "LISTENING" | "THEORY"
    skillComponentIds: string[]
    displayMode: "DEFAULT" | "SHORT"
}
