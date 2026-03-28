import {
  LEVELS_FROM_XP,
  SKILL_COMPONENTS,
  SKILL_MODES,
  SKILL_NODES,
  SKILL_TYPES,
  SkillNodeId,
  SkillTypeId,
} from "@/constants"
import { UserProgress } from "@/domain/progression/UserProgress"
import {
  getLevelForXp,
  getNodeAverageXp,
  getModeStageXp,
  getModeUnlockedStageCount,
  getNodeXpContribution,
  getSkillTypeConfidenceScore,
  getUnlockedNodeIds,
  isNodeMastered,
  isSkillModeUnlocked,
  isSkillTypeUnlocked,
} from "@/logic/progression"
import { loadUserProgress, saveUserProgress } from "@/storage/userProgress"
import { useAppTheme } from "@/theme/ThemeProvider"
import { router, useFocusEffect } from "expo-router"
import { ChevronDown, Crown, Lock, Sparkles, Star, Volume2 } from "lucide-react-native"
import { useCallback, useMemo, useState } from "react"
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import Animated, { FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated"

const RADIAL_SIZE = 420
const RADIAL_CENTER = RADIAL_SIZE / 2
const FLOWER_PETAL_RING_RADIUS = 112
const PETAL_WIDTH = 112
const PETAL_HEIGHT = 52
const PETAL_BASE_OFFSET = 42

function polarToPetal(index: number, total: number, radius: number) {
  const angle = (Math.PI * 2 * index) / Math.max(total, 1) - Math.PI / 2
  const degrees = (angle * 180) / Math.PI

  return {
    x: RADIAL_CENTER + Math.cos(angle) * radius,
    y: RADIAL_CENTER + Math.sin(angle) * radius,
    degrees,
    cos: Math.cos(angle),
    sin: Math.sin(angle),
  }
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function createUnlockedProgress(progress: UserProgress): UserProgress {
  const now = new Date().toISOString()
  const maxXp = Math.max(...Object.values(LEVELS_FROM_XP)) + 500

  return {
    ...progress,
    progression: {
      xp: maxXp,
      level: getLevelForXp(maxXp),
    },
    componentProgresses: Object.fromEntries(
      (Object.keys(SKILL_COMPONENTS) as (keyof typeof SKILL_COMPONENTS)[]).map((skillComponentId) => [
        skillComponentId,
        {
          skillComponentId,
          fsrsValues: {
            difficulty: 2,
            stability: 120,
            scheduledDays: 30,
            elapsedDays: 30,
            reps: 10,
            lapses: 0,
            state: "review",
          },
          dueDate: now,
          lastReviewed: now,
          componentXp: 120,
        },
      ])
    ),
  }
}

function getConfidenceAccent(score: number) {
  if (score >= 85) return { ring: "#D4A017", icon: "#F6C94C" }
  if (score >= 60) return { ring: "#C78B3A", icon: "#E7AE54" }
  return { ring: null, icon: null }
}

function getTypeIcon(skillTypeId: SkillTypeId, color: string) {
  if (skillTypeId === "intervals") return <Volume2 color={color} size={16} />
  if (skillTypeId === "chords") return <Star color={color} size={16} />
  return <Sparkles color={color} size={16} />
}

function getStageBorderColor(theme: ReturnType<typeof useAppTheme>["theme"], unlocked: boolean) {
  if (!unlocked) {
    return theme.cardBorder
  }

  return theme.mode === "dark" ? "rgba(228,111,44,0.14)" : "rgba(217,93,26,0.14)"
}

function getNodeVisualState(
  unlocked: boolean,
  nodeXp: number,
  mastered: boolean,
  theme: ReturnType<typeof useAppTheme>["theme"]
) {
  if (!unlocked) {
    return {
      backgroundColor: theme.mode === "dark" ? "#241C18" : "#F0E8DD",
      borderColor: theme.cardBorder,
      textColor: theme.textSoft,
      glowColor: "transparent",
      coreColor: theme.surface,
      stateLabel: "Locked",
    }
  }

  if (mastered) {
    return {
      backgroundColor: theme.mode === "dark" ? "#5C430A" : "#FFF2C7",
      borderColor: "#D4A017",
      textColor: theme.text,
      glowColor: "#F6C94C",
      coreColor: "#D4A017",
      stateLabel: "Mastered",
    }
  }

  if (nodeXp > 0) {
    return {
      backgroundColor: theme.mode === "dark" ? "#254E2B" : "#DFF5D9",
      borderColor: theme.mode === "dark" ? "#7EDC74" : "#2F9E44",
      textColor: theme.text,
      glowColor: theme.mode === "dark" ? "#7EDC74" : theme.success,
      coreColor: theme.mode === "dark" ? "#7EDC74" : theme.success,
      stateLabel: "Completed",
    }
  }

  return {
    backgroundColor: theme.mode === "dark" ? "#5B3214" : "#FBE6D8",
    borderColor: theme.accent,
    textColor: theme.text,
    glowColor: theme.accent,
    coreColor: theme.accent,
    stateLabel: "Unlocked",
  }
}

export default function SkillTreeScreen() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<SkillNodeId | null>(null)
  const [selectedSkillTypeId, setSelectedSkillTypeId] = useState<SkillTypeId>("notes")
  const [selectedModeId, setSelectedModeId] = useState<string>("notes")
  const [unlockSnapshot, setUnlockSnapshot] = useState<UserProgress | null>(null)
  const { theme } = useAppTheme()

  const load = useCallback(async () => {
    const userProgress = await loadUserProgress()
    setProgress(userProgress)
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load])
  )

  const unlockedNodeIds = useMemo(
    () => (progress ? new Set(getUnlockedNodeIds(progress)) : new Set<SkillNodeId>()),
    [progress]
  )

  const visibleModes = useMemo(
    () => Object.values(SKILL_MODES).filter((mode) => mode.skillType === selectedSkillTypeId),
    [selectedSkillTypeId]
  )

  const selectedMode = visibleModes.find((mode) => mode.id === selectedModeId) ?? visibleModes[0]
  const selectedNode = selectedNodeId ? SKILL_NODES[selectedNodeId] : null

  const selectedType = SKILL_TYPES[selectedSkillTypeId]
  const modePetals = useMemo(
    () =>
      selectedMode.stages.flatMap((stage, stageIndex) =>
        stage.skillNodeIds.map((nodeId) => ({
          nodeId,
          stageIndex,
        }))
      ),
    [selectedMode]
  )

  const ensureModeSelection = useCallback((skillTypeId: SkillTypeId) => {
    const nextModes = Object.values(SKILL_MODES).filter((mode) => mode.skillType === skillTypeId)
    setSelectedModeId(nextModes[0]?.id ?? "")
  }, [])

  async function onUnlockAll() {
    if (!progress) return
    if (!unlockSnapshot) {
      setUnlockSnapshot(deepClone(progress))
    }
    const unlocked = createUnlockedProgress(progress)
    await saveUserProgress(unlocked)
    setProgress(unlocked)
  }

  async function onUndoUnlockAll() {
    if (!unlockSnapshot) return
    await saveUserProgress(unlockSnapshot)
    setProgress(unlockSnapshot)
    setUnlockSnapshot(null)
  }

  if (!progress || !selectedMode) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>Loading skills…</Text>
      </View>
    )
  }

  const modeUnlocked = isSkillModeUnlocked(progress, selectedMode.id)
  const unlockedStageCount = getModeUnlockedStageCount(progress, selectedMode.id)
  const lockedStage = selectedMode.stages[unlockedStageCount]

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.glowOne, { backgroundColor: theme.coolGlow }]} />
      <View style={[styles.glowTwo, { backgroundColor: theme.warmGlow }]} />
      <View style={[styles.skyGlow, { backgroundColor: theme.coolGlow }]} />
      <View style={[styles.meadowGlow, { backgroundColor: theme.mode === "dark" ? "#305B3B" : "#BFE4A1" }]} />
      <View style={[styles.meadowHillOne, { backgroundColor: theme.mode === "dark" ? "#1A3320" : "#D9EFC9" }]} />
      <View style={[styles.meadowHillTwo, { backgroundColor: theme.mode === "dark" ? "#203A27" : "#CBE6B7" }]} />

      <Animated.View entering={FadeInDown.springify().damping(18)} style={styles.hero}>
        <Text style={[styles.heroTitle, { color: theme.text }]}>Skills</Text>
        <View style={styles.heroActions}>
          <Pressable
            onPress={unlockSnapshot ? onUndoUnlockAll : onUnlockAll}
            style={[
              styles.utilityButton,
              { backgroundColor: unlockSnapshot ? theme.successSoft : theme.accentSoft, borderColor: theme.cardBorder },
            ]}
          >
            <Text style={[styles.utilityButtonText, { color: theme.text }]}>
              {unlockSnapshot ? "Undo Unlock All" : "Unlock All"}
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      <View style={styles.typeRow}>
        {Object.values(SKILL_TYPES).map((skillType) => {
          const unlocked = isSkillTypeUnlocked(progress, skillType.id)
          const confidence = getSkillTypeConfidenceScore(progress, skillType.id)
          const accent = getConfidenceAccent(confidence)
          const selected = skillType.id === selectedSkillTypeId

          return (
            <Pressable
              key={skillType.id}
              onPress={() => {
                setSelectedSkillTypeId(skillType.id)
                ensureModeSelection(skillType.id)
              }}
              style={[
                styles.typeChip,
                {
                  backgroundColor: selected ? theme.accent : theme.card,
                  borderColor: selected ? theme.accent : accent.ring ?? theme.cardBorder,
                },
              ]}
            >
              <View
                style={[
                  styles.typeIconWrap,
                  { backgroundColor: selected ? "rgba(255,255,255,0.18)" : theme.surface },
                ]}
              >
                {getTypeIcon(skillType.id, selected ? theme.accentText : unlocked ? theme.text : theme.textSoft)}
              </View>
              <View style={styles.typeChipBody}>
                <Text style={[styles.typeChipTitle, { color: selected ? theme.accentText : theme.text }]}>
                  {skillType.title}
                </Text>
                <Text
                  style={[
                    styles.typeChipMeta,
                    { color: selected ? theme.accentText : unlocked ? theme.success : theme.textSoft },
                  ]}
                >
                  {unlocked ? `${confidence}%` : `L${skillType.levelRequirement}`}
                </Text>
              </View>
              {!unlocked && <Lock size={13} color={selected ? theme.accentText : theme.textSoft} />}
              {unlocked && accent.icon && (
                <View style={styles.typeChipStar}>
                  <Star color={selected ? theme.accentText : accent.icon} size={12} />
                </View>
              )}
              {!unlocked && (
                <View style={styles.typeChipStar}>
                  <Star color={selected ? theme.accentText : theme.textSoft} size={12} />
                </View>
              )}
            </Pressable>
          )
        })}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.modeRow}
        style={styles.modeScroller}
      >
        {visibleModes.map((mode) => {
          const selected = mode.id === selectedMode.id
          const unlocked = isSkillModeUnlocked(progress, mode.id)

          return (
            <Pressable
              key={mode.id}
              onPress={() => setSelectedModeId(mode.id)}
              style={[
                styles.modeChip,
                {
                  backgroundColor: selected ? theme.accent : theme.card,
                  borderColor: selected ? theme.accent : theme.cardBorder,
                },
              ]}
            >
              <Text style={[styles.modeChipText, { color: selected ? theme.accentText : theme.text }]}>
                {mode.title}
              </Text>
              {!unlocked && <Lock size={12} color={selected ? theme.accentText : theme.textSoft} />}
            </Pressable>
          )
        })}
      </ScrollView>

      <View style={[styles.trackHeader, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
        <View>
          <Text style={[styles.trackTitle, { color: theme.text }]}>{selectedMode.title}</Text>
          <Text style={[styles.trackMeta, { color: theme.textSoft }]}>
            {modeUnlocked
              ? `${unlockedStageCount}/${selectedMode.stages.length} rings open`
              : `Level ${selectedMode.levelRequirement} required`}
          </Text>
        </View>
        <ChevronDown color={theme.textSoft} size={18} />
      </View>

      <View style={[styles.radialCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
        <View style={[styles.radialGrassBand, { backgroundColor: theme.mode === "dark" ? "#192C1C" : "#E3F0D8" }]} />
        <Animated.View
          key={`board-${selectedSkillTypeId}-${selectedMode.id}`}
          entering={ZoomIn.duration(420)}
          style={styles.radialBoard}
        >
          <Animated.View
            entering={ZoomIn.duration(260)}
            style={[styles.bloomHalo, { backgroundColor: theme.accentSoft, borderColor: theme.cardBorder }]}
          />
          <Animated.View
            entering={ZoomIn.delay(80).duration(320)}
            style={[styles.bloomHaloMid, { borderColor: theme.cardBorder }]}
          />
          <Animated.View
            entering={ZoomIn.delay(140).duration(360)}
            style={[styles.bloomHaloInner, { borderColor: theme.cardBorder }]}
          />
          <View
            style={[
              styles.stageRing,
              {
                left: RADIAL_CENTER - FLOWER_PETAL_RING_RADIUS,
                top: RADIAL_CENTER - FLOWER_PETAL_RING_RADIUS,
                width: FLOWER_PETAL_RING_RADIUS * 2,
                height: FLOWER_PETAL_RING_RADIUS * 2,
                borderColor: getStageBorderColor(theme, modeUnlocked),
              },
            ]}
          />
          {modePetals.map(({ nodeId, stageIndex }, flatIndex) => {
            const nodeUnlocked = unlockedNodeIds.has(nodeId)
            const nodeXp = getNodeXpContribution(progress, nodeId)
            const nodeAverageXp = Math.round(getNodeAverageXp(progress, nodeId))
            const mastered = isNodeMastered(progress, nodeId)
            const position = polarToPetal(flatIndex, modePetals.length, FLOWER_PETAL_RING_RADIUS)
            const visualState = getNodeVisualState(nodeUnlocked, nodeXp, mastered, theme)

            return (
              <Animated.View
                key={nodeId}
                entering={ZoomIn.delay(140 + flatIndex * 40).springify().damping(14)}
                style={styles.petalWrap}
              >
                <Pressable
                  onPress={() => nodeUnlocked && setSelectedNodeId(nodeId)}
                  disabled={!nodeUnlocked}
                  style={[
                    styles.petalNode,
                    {
                      left: position.x + position.cos * PETAL_BASE_OFFSET - PETAL_WIDTH / 2,
                      top: position.y + position.sin * PETAL_BASE_OFFSET - PETAL_HEIGHT / 2,
                      backgroundColor: visualState.backgroundColor,
                      borderColor: visualState.borderColor,
                      shadowColor: visualState.glowColor,
                      transform: [{ rotate: `${position.degrees}deg` }],
                    },
                  ]}
                >
                  <View style={[styles.petalNotch, { backgroundColor: theme.surface }]} />
                  <View
                    style={[
                      styles.petalVein,
                      { backgroundColor: mastered ? "#D4A017" : nodeUnlocked ? visualState.borderColor : theme.cardBorder },
                    ]}
                  />
                  <View style={[styles.petalInner, { transform: [{ rotate: `${-position.degrees}deg` }] }]}>
                    <View
                      style={[
                        styles.petalCore,
                        {
                          backgroundColor: nodeUnlocked ? visualState.coreColor : theme.surface,
                        },
                      ]}
                    >
                      {mastered ? (
                        <Crown size={14} color={theme.mode === "dark" ? "#1B1408" : "#7A5600"} />
                      ) : nodeUnlocked ? (
                        getTypeIcon(selectedSkillTypeId, nodeXp > 0 ? theme.text : theme.accentText)
                      ) : (
                        <Lock size={14} color={theme.textSoft} />
                      )}
                    </View>
                    <Text style={[styles.petalTitle, { color: visualState.textColor }]} numberOfLines={2}>
                      {SKILL_NODES[nodeId].title}
                    </Text>
                    {mastered && (
                      <Text style={[styles.petalBadge, { color: "#F6C94C" }]} numberOfLines={1}>
                        Mastered
                      </Text>
                    )}
                    {!mastered && nodeUnlocked && nodeXp > 0 && (
                      <Text style={[styles.petalBadge, { color: theme.textSoft }]} numberOfLines={1}>
                        {nodeAverageXp} XP
                      </Text>
                    )}
                  </View>
                </Pressable>
              </Animated.View>
            )
          })}

          <View style={[styles.modeCore, { backgroundColor: theme.background, borderColor: theme.cardBorder }]}>
            {getTypeIcon(selectedSkillTypeId, theme.text)}
            <Text style={[styles.modeCoreTitle, { color: theme.text }]} numberOfLines={2}>
              {selectedType.title}
            </Text>
            <Text style={[styles.modeCoreMeta, { color: theme.textSoft }]}>Mode</Text>
          </View>
        </Animated.View>

        <View style={styles.radialLegend}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: "#FFF2C7", borderColor: "#D4A017" }]} />
            <Text style={[styles.legendText, { color: theme.textSoft }]}>Mastered</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: theme.successSoft, borderColor: theme.success }]} />
            <Text style={[styles.legendText, { color: theme.textSoft }]}>Completed</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: theme.accentSoft, borderColor: theme.accent }]} />
            <Text style={[styles.legendText, { color: theme.textSoft }]}>Unlocked</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: theme.card, borderColor: theme.cardBorder }]} />
            <Text style={[styles.legendText, { color: theme.textSoft }]}>Locked</Text>
          </View>
        </View>

        {!modeUnlocked && (
          <Text style={[styles.requirementHint, { color: theme.textSoft }]}>
            Reach level {selectedMode.levelRequirement} to open this mode.
          </Text>
        )}

        {modeUnlocked && lockedStage && (
          <Text style={[styles.requirementHint, { color: theme.textSoft }]}>
            {unlockedStageCount === 0
              ? `${lockedStage.globalXpRequirement} global XP to open ring 1`
              : `${getModeStageXp(progress, selectedMode.id, unlockedStageCount - 1)}/${lockedStage.previousStageXpRequirement} previous-ring XP for ring ${unlockedStageCount + 1}`}
          </Text>
        )}
      </View>

      <Modal
        visible={!!selectedNode}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedNodeId(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{selectedNode?.title}</Text>
            <Text style={[styles.modalDescription, { color: theme.textMuted }]}>
              {selectedNode?.skillComponentIds.length} cards in this petal
            </Text>
            {selectedNode && (
              <Animated.View entering={FadeInUp.duration(220)} style={styles.modalStats}>
                <Text style={[styles.modalStatPill, { color: theme.text, backgroundColor: theme.accentSoft }]}>
                  {isNodeMastered(progress, selectedNode.id)
                    ? "Mastered"
                    : getNodeXpContribution(progress, selectedNode.id) > 0
                      ? "Completed"
                      : unlockedNodeIds.has(selectedNode.id)
                        ? "Unlocked"
                        : "Locked"}
                </Text>
                <Text style={[styles.modalStatText, { color: theme.textSoft }]}>
                  Avg XP {Math.round(getNodeAverageXp(progress, selectedNode.id))}
                </Text>
              </Animated.View>
            )}

            {selectedNode && unlockedNodeIds.has(selectedNode.id) && (
              <Pressable
                onPress={() => {
                  setSelectedNodeId(null)
                  router.push({
                    pathname: "/session",
                    params: { practiceNodeId: selectedNode.id, practiceCardCount: "10" },
                  })
                }}
                style={[styles.practiceButton, { backgroundColor: theme.successSoft, borderColor: theme.success }]}
              >
                <Text style={[styles.practiceButtonText, { color: theme.text }]}>Practice Node</Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => setSelectedNodeId(null)}
              style={[styles.modalButton, { backgroundColor: theme.accent }]}
            >
              <Text style={[styles.modalButtonText, { color: theme.accentText }]}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 22,
    fontWeight: "700",
  },
  glowOne: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    opacity: 0.15,
    top: -60,
    right: -60,
  },
  glowTwo: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    opacity: 0.12,
    bottom: 80,
    left: -80,
  },
  skyGlow: {
    position: "absolute",
    width: 520,
    height: 240,
    borderRadius: 999,
    opacity: 0.12,
    top: -70,
    left: -100,
  },
  meadowGlow: {
    position: "absolute",
    left: -40,
    right: -40,
    bottom: 60,
    height: 220,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
    opacity: 0.16,
  },
  meadowHillOne: {
    position: "absolute",
    left: -30,
    width: 280,
    bottom: -10,
    height: 110,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 220,
    opacity: 0.7,
  },
  meadowHillTwo: {
    position: "absolute",
    right: -10,
    width: 320,
    bottom: -20,
    height: 130,
    borderTopLeftRadius: 220,
    borderTopRightRadius: 180,
    opacity: 0.75,
  },
  hero: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "800",
  },
  heroActions: {
    marginTop: 12,
    flexDirection: "row",
  },
  utilityButton: {
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  utilityButtonText: {
    fontWeight: "800",
  },
  typeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  typeChip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 74,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  typeIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  typeChipBody: {
    flex: 1,
  },
  typeChipTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  typeChipMeta: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  typeChipStar: {
    marginLeft: 8,
  },
  modeScroller: {
    marginBottom: 14,
  },
  modeRow: {
    gap: 10,
    paddingRight: 12,
  },
  modeChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modeChipText: {
    fontWeight: "800",
    fontSize: 13,
  },
  trackHeader: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  trackMeta: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: "700",
  },
  radialCard: {
    borderRadius: 32,
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  radialGrassBand: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 88,
    opacity: 0.35,
  },
  radialBoard: {
    width: RADIAL_SIZE,
    height: RADIAL_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  bloomHalo: {
    position: "absolute",
    width: 302,
    height: 302,
    borderRadius: 999,
    opacity: 0.2,
    borderWidth: 1,
  },
  bloomHaloMid: {
    position: "absolute",
    width: 236,
    height: 236,
    borderRadius: 999,
    borderWidth: 1,
    opacity: 0.28,
  },
  bloomHaloInner: {
    position: "absolute",
    width: 176,
    height: 176,
    borderRadius: 999,
    borderWidth: 1,
    opacity: 0.4,
  },
  stageRing: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1,
  },
  modeCore: {
    width: 132,
    height: 132,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  modeCoreTitle: {
    fontWeight: "900",
    fontSize: 16,
  },
  modeCoreMeta: {
    fontWeight: "700",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  petalWrap: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  petalNode: {
    position: "absolute",
    width: PETAL_WIDTH,
    height: PETAL_HEIGHT,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
    borderWidth: 1.75,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 6,
    overflow: "visible",
  },
  petalNotch: {
    position: "absolute",
    left: -14,
    top: 10,
    width: 34,
    height: 34,
    borderRadius: 999,
  },
  petalVein: {
    position: "absolute",
    left: 24,
    right: 24,
    top: "50%",
    height: 1.5,
    opacity: 0.42,
  },
  petalInner: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 8,
  },
  petalCore: {
    width: 22,
    height: 22,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  petalTitle: {
    fontSize: 9,
    lineHeight: 10,
    fontWeight: "800",
    textAlign: "center",
  },
  petalBadge: {
    marginTop: 2,
    fontSize: 9,
    lineHeight: 10,
    fontWeight: "800",
    textAlign: "center",
  },
  radialLegend: {
    marginTop: 18,
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "700",
  },
  requirementHint: {
    marginTop: 14,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.56)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  modalDescription: {
    marginBottom: 12,
    lineHeight: 21,
  },
  modalStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  modalStatPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "800",
  },
  modalStatText: {
    fontSize: 12,
    fontWeight: "700",
  },
  practiceButton: {
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  practiceButtonText: {
    textAlign: "center",
    fontWeight: "800",
  },
  modalButton: {
    paddingVertical: 14,
    borderRadius: 18,
  },
  modalButtonText: {
    textAlign: "center",
    fontWeight: "800",
  },
})
