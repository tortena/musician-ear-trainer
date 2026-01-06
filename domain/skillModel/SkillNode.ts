import { SkillComponentId } from "./SkillComponent"
import { SkillModeId } from "./SkillMode"

export type SkillNodeId = string

export const NODE_TYPES = ['LISTENING', 'THEORY'] as const
export type NodeType = typeof NODE_TYPES[number]

export type SkillNode = {
    id: SkillNodeId
    title: string
    description?: string
    skillMode: SkillModeId
    nodeType: NodeType
    skillComponentIds: SkillComponentId[]
}