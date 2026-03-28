import { SKILL_COMPONENTS, SkillComponentId } from "@/constants"
import { playSkillComponentAudio } from "@/audio/audio"
import { TheoryPrompt } from "@/components/theory/TheoryPrompt"
import { DisplayToken } from "@/domain/session/DisplayToken"
import { TokenId } from "@/domain/skillModel/Token"
import { SessionController } from "@/session/sessionController"
import { useAppTheme } from "@/theme/ThemeProvider"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Flame, Volume2 } from "lucide-react-native"
import { useCallback, useEffect, useRef, useState } from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated"

import { BottomActionBar } from "../../components/session/BottomActionBar"
import { TokenChip } from "../../components/session/TokenChip"

export default function SessionScreen() {
  const [tokens, setTokens] = useState<DisplayToken[]>([])
  const [selected, setSelected] = useState<TokenId[]>([])
  const [correctAnswer, setCorrectAnswer] = useState<TokenId[] | null>(null)
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [undoCount, setUndoCount] = useState(0)
  const [sessionController, setSessionController] = useState<SessionController | null>(null)
  const [startTime, setStartTime] = useState<number>(0)
  const [stats, setStats] = useState({ correctNum: 0, incorrectNum: 0, streak: 0 })
  const [questionsLeft, setQuestionsLeft] = useState(0)
  const [displayedSkillComponentId, setDisplayedSkillComponentId] = useState<SkillComponentId | null>(null)
  const [shouldRandomiseRoot, setShouldRandomiseRoot] = useState(false)
  const [questionVersion, setQuestionVersion] = useState(0)
  const [continuePending, setContinuePending] = useState(false)

  const router = useRouter()
  const params = useLocalSearchParams<{ practiceNodeId?: string; practiceCardCount?: string }>()
  const mountedRef = useRef(true)
  const { theme } = useAppTheme()

  useEffect(() => {
    let mounted = true

    async function startSession() {
      const controller = await SessionController.start({
        minNewFlashcards: params.practiceNodeId ? 0 : 4,
        maxNewFlashcards: params.practiceNodeId ? 0 : 6,
        maxFlashcardNum: params.practiceNodeId ? Number(params.practiceCardCount ?? 10) : 15,
        practiceNodeId: params.practiceNodeId,
        practiceCardCount: params.practiceNodeId ? Number(params.practiceCardCount ?? 10) : undefined,
      })

      if (!mounted) return

      setSessionController(controller)

      const t = await controller.getDisplayTokens()
      if (!mounted) return

      setTokens(t)
      setSelected([])
      setCorrectAnswer(null)
      setWasCorrect(null)
      setIsAnswered(false)
      setUndoCount(0)
      setStats(controller.getStats())
      setQuestionsLeft(controller.getTotalQuestions() - controller.getCurrentQuestionIndex() - 1)
      setDisplayedSkillComponentId(controller.getCurrentSkillComponentId())
      setShouldRandomiseRoot(controller.shouldRootBeRandomised())
      setQuestionVersion(0)
      setStartTime(Date.now())
    }

    startSession()

    return () => {
      mounted = false
    }
  }, [params.practiceCardCount, params.practiceNodeId])

  const loadQuestion = useCallback(async () => {
    if (!sessionController) return

    const t = await sessionController.getDisplayTokens()
    if (!mountedRef.current) return

    setTokens(t)
    setSelected([])
    setCorrectAnswer(null)
    setWasCorrect(null)
    setIsAnswered(false)
    setUndoCount(0)
    setStartTime(Date.now())
    setStats(sessionController.getStats())
    setQuestionsLeft(sessionController.getTotalQuestions() - sessionController.getCurrentQuestionIndex() - 1)
    setDisplayedSkillComponentId(sessionController.getCurrentSkillComponentId())
    setShouldRandomiseRoot(sessionController.shouldRootBeRandomised())
    setQuestionVersion((prev) => prev + 1)
  }, [sessionController])

  async function onCheck() {
    if (!sessionController || isAnswered || sessionController.isFinished()) return

    try {
      const correctTokenIds = sessionController.getCorrectTokenIds()
      const timeMs = Date.now() - startTime

      const res = await sessionController.submitAnswer({
        userTokenIds: selected,
        correctTokenIds,
        timeMs,
        undoCount,
      })

      setIsAnswered(true)
      setWasCorrect(res.correct)
      setCorrectAnswer(res.correctAnswer)
      setStats(sessionController.getStats())
      setQuestionsLeft(sessionController.getTotalQuestions() - sessionController.getCurrentQuestionIndex() - 1)
    } catch (error) {
      console.error("Error submitting answer:", error)
    }
  }

  async function onContinue() {
    if (!sessionController || !isAnswered || continuePending) return
    setContinuePending(true)

    try {
      if (sessionController.isFinished()) {
        const review = await sessionController.endSession()
        router.replace({
          pathname: "/session/result",
          params: { review: JSON.stringify(review) },
        })
        return
      }

      await loadQuestion()
    } catch (error) {
      console.error("Error continuing session:", error)
    } finally {
      if (mountedRef.current) {
        setContinuePending(false)
      }
    }
  }

  function onUndo() {
    if (selected.length === 0 || isAnswered) return
    setSelected((prev) => prev.slice(0, -1))
    setUndoCount((c) => c + 1)
  }

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  if (!sessionController) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>Starting session…</Text>
      </View>
    )
  }

  const totalQuestions = sessionController.getTotalQuestions()
  const completedQuestions = stats.correctNum + stats.incorrectNum
  const progressRatio = totalQuestions > 0 ? completedQuestions / totalQuestions : 0
  const selectedSet = new Set(selected)
  const correctSet = new Set(correctAnswer ?? [])
  const currentPrompt =
    displayedSkillComponentId ? SKILL_COMPONENTS[displayedSkillComponentId]?.prompt : { kind: "AUDIO" as const }
  const isTheoryPrompt = currentPrompt?.kind === "PIANO" || currentPrompt?.kind === "STAFF"

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.glowOne, { backgroundColor: theme.warmGlow }]} />
      <View style={[styles.glowTwo, { backgroundColor: theme.coolGlow }]} />

      <Animated.View entering={FadeInDown.springify().damping(18)} style={styles.topRow}>
        <Text style={[styles.stepText, { color: theme.textSoft }]}>
          Question {Math.min(completedQuestions + 1, totalQuestions)} of {totalQuestions}
        </Text>
        <Text style={[styles.scoreText, { color: theme.success }]}>+{stats.correctNum * 10} score</Text>
      </Animated.View>

      <View style={[styles.sessionProgressTrack, { backgroundColor: theme.progressTrack }]}>
        <Animated.View
          style={[
            styles.sessionProgressFill,
            {
              width: `${Math.min(progressRatio * 100, 100)}%`,
              backgroundColor: theme.progressFill,
            },
          ]}
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.springify().damping(18)} style={styles.miniHud}>
          <View style={[styles.miniHudPill, { backgroundColor: theme.accentSoft, borderColor: theme.cardBorder }]}>
            <Flame color={theme.accent} size={14} />
            <Text style={[styles.miniHudText, { color: theme.text }]}>{stats.streak}</Text>
          </View>
          <View style={[styles.miniHudPill, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.miniHudText, { color: theme.text }]}>
              {questionsLeft} left
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          key={`question-${questionVersion}`}
          entering={FadeInDown.delay(100).springify().damping(18)}
          style={styles.challengeCard}
        >
          <Text style={[styles.challengeTitle, { color: theme.text }]}>{isTheoryPrompt ? "Look" : "Listen"}</Text>

          {isTheoryPrompt && displayedSkillComponentId ? (
            <TheoryPrompt skillComponentId={displayedSkillComponentId} />
          ) : (
            <Pressable
              onPress={() =>
                displayedSkillComponentId &&
                playSkillComponentAudio(displayedSkillComponentId, shouldRandomiseRoot)
              }
              style={[styles.audioButton, { backgroundColor: theme.accent }]}
            >
              <Volume2 color={theme.accentText} size={28} />
            </Pressable>
          )}
        </Animated.View>

        <View style={[styles.answerWell, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.answerRow}>
            {selected.length === 0 && !isAnswered ? (
              <Text style={[styles.placeholderText, { color: theme.textSoft }]}>Select tiles</Text>
            ) : (
              selected.map((id, i) => {
                const label = tokens.find((t) => t.tokenId === id)?.textToDisplayAsToken ?? id
                const isSelectedCorrect = isAnswered && correctSet.has(id)

                return (
                  <TokenChip
                    key={i}
                    label={label}
                    selected={!isAnswered}
                    correct={isSelectedCorrect}
                    incorrect={isAnswered && !isSelectedCorrect}
                    onPress={() =>
                      !isAnswered && setSelected((prev) => prev.filter((_, idx) => idx !== i))
                    }
                  />
                )
              })
            )}
          </View>
        </View>

        {isAnswered && wasCorrect !== null && (
          <Animated.View
            entering={FadeIn}
            style={[
              styles.feedbackBanner,
              {
                backgroundColor: wasCorrect ? theme.successSoft : theme.dangerSoft,
                borderColor: wasCorrect ? theme.success : theme.danger,
              },
            ]}
          >
            <Text style={[styles.feedbackTitle, { color: theme.text }]}>
              {wasCorrect ? "Correct" : "Incorrect"}
            </Text>
          </Animated.View>
        )}

        {isAnswered && correctAnswer && (
          <Animated.View entering={FadeIn} style={styles.correctRow}>
            <View style={styles.answerRow}>
              {correctAnswer.map((id, i) => {
                const label = tokens.find((t) => t.tokenId === id)?.textToDisplayAsToken ?? id
                return (
                  <TokenChip
                    key={i}
                    label={label}
                    correct
                    disabled={selectedSet.has(id)}
                  />
                )
              })}
            </View>
          </Animated.View>
        )}

        <View style={styles.bankWrap}>
          {tokens.map((token) => (
            <TokenChip
              key={token.tokenId}
              label={token.textToDisplayAsToken}
              disabled={selected.includes(token.tokenId) || isAnswered}
              onPress={() => !isAnswered && setSelected((prev) => [...prev, token.tokenId])}
            />
          ))}
        </View>
      </ScrollView>

      <BottomActionBar
        onUndo={onUndo}
        onCheck={onCheck}
        onContinue={onContinue}
        disabled={selected.length === 0 || continuePending}
        answered={isAnswered}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  glowOne: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 999,
    opacity: 0.16,
    top: -90,
    right: -80,
  },
  glowTwo: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 999,
    opacity: 0.12,
    bottom: 80,
    left: -90,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "700",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  stepText: {
    fontSize: 13,
    fontWeight: "700",
  },
  scoreText: {
    fontSize: 13,
    fontWeight: "800",
  },
  sessionProgressTrack: {
    height: 14,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 14,
  },
  sessionProgressFill: {
    height: "100%",
    borderRadius: 999,
  },
  miniHud: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 18,
  },
  miniHudPill: {
    minWidth: 82,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  miniHudText: {
    fontSize: 13,
    fontWeight: "800",
  },
  challengeCard: {
    alignItems: "center",
    marginBottom: 18,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 14,
  },
  audioButton: {
    width: 88,
    height: 88,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  answerWell: {
    borderRadius: 22,
    minHeight: 84,
    borderWidth: 1,
    padding: 12,
    justifyContent: "center",
    marginBottom: 14,
  },
  answerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    minHeight: 56,
  },
  placeholderText: {
    fontSize: 15,
    textAlign: "center",
    paddingVertical: 14,
  },
  feedbackBanner: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    borderWidth: 1,
  },
  feedbackTitle: {
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
  correctRow: {
    marginBottom: 14,
    alignItems: "center",
  },
  bankWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: 4,
  },
})
