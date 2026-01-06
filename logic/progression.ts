import { SKILL_MODES, SKILL_NODES, SkillComponentId, SkillNodeId } from "@/constants";
import { UserProgress } from "@/domain/progression/UserProgress";

function calculateNodeXpContribution(userProgress: UserProgress, skillNodeId: SkillNodeId): number {
    return userProgress.progression.xp //TODO: Do algorithm properly
}

export function getUnlockedNodeIds(userProgress: UserProgress): SkillNodeId[] {
    var unlockedNodeIds: SkillNodeId[] = []

    for (var skillMode of Object.values(SKILL_MODES)) {
        if (skillMode.levelRequirement <= userProgress.progression.level){
            for (var stage of skillMode.stages) {
                for (var skillNodeId of stage.skillNodeIds) {
                    if (stage.xpRequirement <= calculateNodeXpContribution(userProgress,skillNodeId))
                        unlockedNodeIds.push(skillNodeId)
                }
            }
        }
    }

    return unlockedNodeIds
}

export function getUnlockedSkillComponentIds(userProgress: UserProgress): SkillComponentId[] {
    const unlockedNodeIds = getUnlockedNodeIds(userProgress)
    const unlockedNodes = unlockedNodeIds.map((p => SKILL_NODES[p]))

    
    var unlockedSkillComponentIds: SkillComponentId[] = []

    for (var skillNode of unlockedNodes) {
        unlockedSkillComponentIds.push(...skillNode.skillComponentIds)
    }

    return unlockedSkillComponentIds
}