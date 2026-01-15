import { useRouter } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"

import { SessionController } from "@/session/sessionController"
import { BottomActionBar } from "../../components/session/BottomActionBar"
import { SessionHeader } from "../../components/session/SessionHeader"
import { TokenChip } from "../../components/session/TokenChip"

import { playAudio } from "@/audio/audio"
import { DisplayToken } from "@/domain/session/DisplayToken"
import { TokenId } from "@/domain/skillModel/Token"


export default function SessionScreen() {
  const [tokens, setTokens] = useState<DisplayToken[]>([])
  const [selected, setSelected] = useState<TokenId[]>([])
  const [correctAnswer, setCorrectAnswer] = useState<TokenId[] | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [undoCount, setUndoCount] = useState(0)
  const [sessionController, setSessionController] = useState<SessionController | null>(null)
  const [startTime, setStartTime] = useState<number>(0)
  const [stats, setStats] = useState({ correctNum: 0, incorrectNum: 0, streak: 0 })
  const [questionsLeft, setQuestionsLeft] = useState(0)

  const router = useRouter()
  const mountedRef = useRef(true)

  // 1️⃣ Start session ONCE
  useEffect(() => {
    let mounted = true

    async function startSession() {
      const controller = await SessionController.start({
        minNewFlashcards: 4,
        maxNewFlashcards: 6,
        maxFlashcardNum: 15,
      })

      if (!mounted) return

      setSessionController(controller)

      const t = await controller.getDisplayTokens()
      if (!mounted) return

      setTokens(t)
      setSelected([])
      setCorrectAnswer(null)
      setIsAnswered(false)
      setUndoCount(0)
      setStats(controller.getStats())
      setQuestionsLeft(controller.getTotalQuestions() - controller.getCurrentQuestionIndex() - 1)
      setStartTime(Date.now())
    }

    startSession()

    return () => {
      mounted = false
    }
  }, [])

  // 2️⃣ Load a question
  const loadQuestion = useCallback(async () => {
    if (!sessionController) return

    const t = await sessionController.getDisplayTokens()
    if (!mountedRef.current) return

    setTokens(t)
    setSelected([])
    setCorrectAnswer(null)
    setIsAnswered(false)
    setUndoCount(0)
    setStartTime(Date.now())
    setStats(sessionController.getStats())
    setQuestionsLeft(sessionController.getTotalQuestions() - sessionController.getCurrentQuestionIndex() - 1)
  }, [sessionController])

  // 3️⃣ Handle check answer
  async function onCheck() {
    if (!sessionController || isAnswered) return

    const correctTokenIds = sessionController.getCorrectTokenIds()
    const timeMs = Date.now() - startTime

    const res = await sessionController.submitAnswer({
      userTokenIds: selected,
      correctTokenIds,
      timeMs,
      undoCount,
    })

    setIsAnswered(true)
    setCorrectAnswer(res.correctAnswer)
    setStats(sessionController.getStats()) // Update stats after answer

    // Capture controller reference to avoid stale closure
    const controller = sessionController
    const isFinished = controller.isFinished()

    // Wait 900ms, then move on
    setTimeout(async () => {
      if (!mountedRef.current) return

      try {
        if (isFinished) {
          const review = await controller.endSession()
          router.replace({
            pathname: "./result",
            params: { review: JSON.stringify(review) },
          })
        } else {
          await loadQuestion()
        }
      } catch (error) {
        console.error('Error finishing session:', error)
      }
    }, 900)
  }

  // 4️⃣ Undo last selection
  function onUndo() {
    if (selected.length === 0 || isAnswered) return
    setSelected(prev => prev.slice(0, -1))
    setUndoCount(c => c + 1)
  }

  // 5️⃣ Loading guard
  if (!sessionController) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "white" }}>Starting session…</Text>
      </View>
    )
  }

  // 6️⃣ Render
  return (
    <View style={styles.container}>
      <SessionHeader 
        streak={stats.streak}
        correctNum={stats.correctNum}
        incorrectNum={stats.incorrectNum}
        questionsLeft={questionsLeft}
      />

      <Pressable onPress={() => playAudio(sessionController.getCurrentSampleFolder())}>
        <Text style={styles.audio}>🎧 Play sound</Text>
      </Pressable>

      {/* Selected answer */}
      <View style={styles.answerRow}>
        {selected.map((id, i) => {
          const label = tokens.find(t => t.tokenId === id)?.textToDisplayAsToken ?? id
          return (
            <TokenChip
              key={i}
              label={label}
              selected
              onPress={() =>
                !isAnswered && setSelected(prev => prev.filter((_, idx) => idx !== i))
              }
            />
          )
        })}
      </View>

      {/* Correct answer */}
      {isAnswered && correctAnswer && (
        <Animated.View entering={FadeIn} style={styles.correctRow}>
          <Text style={styles.correctLabel}>Correct answer:</Text>
          <View style={styles.answerRow}>
            {correctAnswer.map((id, i) => {
              const label = tokens.find(t => t.tokenId === id)?.textToDisplayAsToken ?? id
              return <TokenChip key={i} label={label} correct />
            })}
          </View>
        </Animated.View>
      )}

      {/* Token bank */}
      <View style={styles.tokenBank}>
        {tokens.map(token => (
          <TokenChip
            key={token.tokenId}
            label={token.textToDisplayAsToken}
            disabled={selected.includes(token.tokenId) || isAnswered}
            onPress={() => !isAnswered && setSelected(prev => [...prev, token.tokenId])}
          />
        ))}
      </View>

      <BottomActionBar
        onUndo={onUndo}
        onCheck={onCheck}
        disabled={selected.length === 0}
        answered={isAnswered}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0B14",
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  audio: {
    color: "#A78BFA",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 24,
  },

  answerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    minHeight: 56,
    marginBottom: 16,
  },

  tokenBank: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#1F1B2E",
    },


  correctRow: {
    marginBottom: 16,
    alignItems: "center",
  },

  correctLabel: {
    color: "#22C55E",
    fontWeight: "700",
    marginBottom: 6,
  },
})
