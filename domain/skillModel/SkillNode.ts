import { DisplayMode, NodeType, SkillComponentId } from "@/constants"

export type SkillNode = {
    id: string
    title: string
    description?: string
    skillMode: string
    nodeType: NodeType
    skillComponentIds: SkillComponentId[]
    displayMode: DisplayMode
}