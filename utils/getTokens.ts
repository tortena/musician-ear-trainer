import { SKILL_COMPONENTS, SKILL_MODES, SKILL_NODES, SkillComponentId, SkillNodeId } from "@/constants";
import { UserProgress } from "@/domain/progression/UserProgress";
import { TokenId } from "@/domain/skillModel/Token";
import { getNodeAverageXp } from "@/logic/progression";
import { getModeFromComponent, getNodeFromComponent, getNodesFromMode } from "./hierarchy";

const CHILD_LAYER_CONFIDENCE_XP = 35

export function getTokensForNode(skillNodeId: SkillNodeId): TokenId[] {
    var tokenSet: Set<TokenId> = new Set()

    const skillComponentIds = SKILL_NODES[skillNodeId].skillComponentIds

    skillComponentIds.forEach((componentId) => {
        SKILL_COMPONENTS[componentId].tokenIds.forEach((tokenId) => tokenSet.add(tokenId))
    })

    return [...tokenSet]   
}

export function getTokensForNodeFromComponent(skillComponentId: SkillComponentId): TokenId[] {
    return getTokensForNode(getNodeFromComponent(skillComponentId))
}


export function getUnlockedTokensForModeFromComponent(userProgress: UserProgress, skillComponentId: SkillComponentId): TokenId[] {
    var modeTokenSet: Set<TokenId> = new Set()
    var unlockedTokenSet: Set<TokenId> = new Set()
    const skillModeId = getModeFromComponent(skillComponentId)
    const currentNodeId = getNodeFromComponent(skillComponentId)
    const currentStageIndex = SKILL_MODES[skillModeId].stages.findIndex((stage) =>
        (stage.skillNodeIds as readonly SkillNodeId[]).includes(currentNodeId)
    )
    const includeChildLayers = getNodeAverageXp(userProgress, currentNodeId) >= CHILD_LAYER_CONFIDENCE_XP

    SKILL_MODES[skillModeId].stages.forEach((stage, stageIndex) => {
        if (currentStageIndex !== -1 && stageIndex > currentStageIndex && !includeChildLayers) {
            return
        }

        stage.skillNodeIds.forEach((skillNodeId) => {
            getTokensForNode(skillNodeId).forEach((modeTokenId) => modeTokenSet.add(modeTokenId))
        })
    })

    for (const skillComponentId of Object.keys(userProgress.componentProgresses) as SkillComponentId[]) {
        SKILL_COMPONENTS[skillComponentId].tokenIds.forEach((userTokenId) => unlockedTokenSet.add(userTokenId))
    }

    const intersection: TokenId[] = []

    for (const token of modeTokenSet) {
        if (unlockedTokenSet.has(token)) {
            intersection.push(token)
        }
    }

    return intersection
}
