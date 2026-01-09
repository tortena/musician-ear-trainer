import { SKILL_COMPONENTS, SKILL_NODES, SkillComponentId, SkillModeId, SkillNodeId } from "@/constants";
import { UserProgress } from "@/domain/progression/UserProgress";
import { TokenId } from "@/domain/skillModel/Token";
import { getModeFromComponent, getNodeFromComponent, getNodesFromMode } from "./hierarchy";
import { loadUserProgress } from "@/storage/userProgress";

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

    getNodesFromMode(getModeFromComponent(skillComponentId)).forEach(
        (skillNodeId) => getTokensForNode(skillNodeId).forEach(
            (modeTokenId) => modeTokenSet.add(modeTokenId)
        )
    )

    for (const skillComponentId of Object.keys(userProgress.componentProgress) as SkillComponentId[]) {
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