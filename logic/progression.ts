import {
  LEVELS_FROM_XP,
  SKILL_MODES,
  SKILL_NODES,
  SKILL_TYPES,
  SkillComponentId,
  SkillModeId,
  SkillNodeId,
  SkillTypeId,
} from "@/constants"
import { UserProgress } from "@/domain/progression/UserProgress"

const TARGET_COMPONENT_CONFIDENCE_XP = 80
const TARGET_COMPONENT_MASTERY_XP = 140

export function getNodeXpContribution(userProgress: UserProgress, skillNodeId: SkillNodeId): number {
  const node = SKILL_NODES[skillNodeId]

  return node.skillComponentIds.reduce((total, componentId) => {
    return total + (userProgress.componentProgresses[componentId]?.componentXp ?? 0)
  }, 0)
}

export function getNodeAverageXp(userProgress: UserProgress, skillNodeId: SkillNodeId): number {
  const node = SKILL_NODES[skillNodeId]

  return getNodeXpContribution(userProgress, skillNodeId) / node.skillComponentIds.length
}

export function isNodeMastered(userProgress: UserProgress, skillNodeId: SkillNodeId): boolean {
  return getNodeAverageXp(userProgress, skillNodeId) >= TARGET_COMPONENT_MASTERY_XP
}

export function getModeStageXp(userProgress: UserProgress, skillModeId: SkillModeId, stageIndex: number): number {
  const stage = SKILL_MODES[skillModeId].stages[stageIndex]
  if (!stage) return 0

  return stage.skillNodeIds.reduce((total, nodeId) => total + getNodeXpContribution(userProgress, nodeId), 0)
}

export function isSkillTypeUnlocked(userProgress: UserProgress, skillTypeId: SkillTypeId) {
  return userProgress.progression.level >= SKILL_TYPES[skillTypeId].levelRequirement
}

export function isSkillModeUnlocked(userProgress: UserProgress, skillModeId: SkillModeId) {
  const mode = SKILL_MODES[skillModeId]
  return isSkillTypeUnlocked(userProgress, mode.skillType) && userProgress.progression.level >= mode.levelRequirement
}

export function isStageUnlocked(userProgress: UserProgress, skillModeId: SkillModeId, stageIndex: number) {
  const mode = SKILL_MODES[skillModeId]
  const stage = mode.stages[stageIndex]

  if (!stage || !isSkillModeUnlocked(userProgress, skillModeId)) {
    return false
  }

  const hasGlobalXp = userProgress.progression.xp >= stage.globalXpRequirement
  const previousStageXp =
    stageIndex === 0 ? Infinity : getModeStageXp(userProgress, skillModeId, stageIndex - 1)
  const hasPreviousLayerXp = previousStageXp >= stage.previousStageXpRequirement

  return hasGlobalXp && hasPreviousLayerXp
}

export function getUnlockedNodeIds(userProgress: UserProgress): SkillNodeId[] {
  const unlockedNodeIds: SkillNodeId[] = []

  for (const skillMode of Object.values(SKILL_MODES)) {
    for (let stageIndex = 0; stageIndex < skillMode.stages.length; stageIndex += 1) {
      if (!isStageUnlocked(userProgress, skillMode.id, stageIndex)) {
        break
      }

      unlockedNodeIds.push(...skillMode.stages[stageIndex].skillNodeIds)
    }
  }

  return unlockedNodeIds
}

export function getUnlockedSkillComponentIds(userProgress: UserProgress): SkillComponentId[] {
  const unlockedNodeIds = getUnlockedNodeIds(userProgress)
  const unlockedNodes = unlockedNodeIds.map((nodeId) => SKILL_NODES[nodeId])
  const unlockedSkillComponentIds: SkillComponentId[] = []

  for (const skillNode of unlockedNodes) {
    unlockedSkillComponentIds.push(...skillNode.skillComponentIds)
  }

  return unlockedSkillComponentIds
}

export function getSkillTypeConfidenceScore(userProgress: UserProgress, skillTypeId: SkillTypeId) {
  const componentIds = Object.values(SKILL_NODES)
    .filter((node) => node.skillMode in SKILL_MODES && SKILL_MODES[node.skillMode as SkillModeId].skillType === skillTypeId)
    .flatMap((node) => node.skillComponentIds)

  if (componentIds.length === 0) {
    return 0
  }

  const mastery = componentIds.reduce((total, componentId) => {
    const componentXp = userProgress.componentProgresses[componentId]?.componentXp ?? 0
    return total + Math.min(componentXp / TARGET_COMPONENT_CONFIDENCE_XP, 1)
  }, 0)

  return Math.round((mastery / componentIds.length) * 100)
}

export function getModeUnlockedStageCount(userProgress: UserProgress, skillModeId: SkillModeId) {
  let count = 0

  for (let stageIndex = 0; stageIndex < SKILL_MODES[skillModeId].stages.length; stageIndex += 1) {
    if (!isStageUnlocked(userProgress, skillModeId, stageIndex)) {
      break
    }
    count += 1
  }

  return count
}

export function getLevelForXp(userXp: number) {
  let maxLevel = 1
  let maxXpRequirement = 0

  for (const [level, xpRequirement] of Object.entries(LEVELS_FROM_XP)) {
    if (userXp >= xpRequirement && xpRequirement >= maxXpRequirement) {
      maxLevel = Number(level)
      maxXpRequirement = xpRequirement
    }
  }

  return maxLevel
}

export function getXpForLevel(level: number): number {
  return LEVELS_FROM_XP[level] ?? 0
}
