import { SKILL_MODES, SKILL_NODES, SkillComponentId, SkillModeId, SkillNodeId, SkillTypeId } from "@/constants";

export function getNodeFromComponent(skillComponentId: SkillComponentId): SkillNodeId {
    for (const [skillNodeId, node] of Object.entries(SKILL_NODES)) {
        if ((node.skillComponentIds as readonly SkillComponentId[]).includes(skillComponentId)) {
            return skillNodeId as SkillNodeId
        }
    }
    throw new Error("No node found for given skillComponentId")
}

export function getModeFromNode(skillNodeId: SkillNodeId): SkillModeId {
    return SKILL_NODES[skillNodeId].skillMode
}

export function getModeFromComponent(skillComponentId: SkillComponentId): SkillModeId {
    return getModeFromNode(getNodeFromComponent(skillComponentId))
}

export function getNodesFromMode(skillModeId:SkillModeId): SkillNodeId[] {
    var nodeIdSet: Set<SkillNodeId> = new Set()
    
    SKILL_MODES[skillModeId].stages.forEach((stage) => {
        stage.skillNodeIds.forEach((skillNodeId) => nodeIdSet.add(skillNodeId))
    })

    return [...nodeIdSet]
}

export function getSkillTypeFromComponent(skillComponentId: SkillComponentId): SkillTypeId {
    return SKILL_MODES[getModeFromComponent(skillComponentId)].skillType
}