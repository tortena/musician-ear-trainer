import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
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

  const router = useRouter()
  const mountedRef = useRef(true)

  // 1️⃣ Start session ONCE
  useEffect(() => {
    mountedRef.current = true

    async function startSession() {
      const controller = await SessionController.start({
        minNewFlashcards: 4,
        maxNewFlashcards: 6,
        maxFlashcardNum: 15,
      })

      if (!mountedRef.current) return

      setSessionController(controller)
      await loadQuestion(controller)
    }

    startSession()

    return () => {
      mountedRef.current = false
    }
  }, [])

  // 2️⃣ Load a question
  async function loadQuestion(controller?: SessionController) {
    const ctrl = controller ?? sessionController
    if (!ctrl) return

    const t = await ctrl.getDisplayTokens()
    if (!mountedRef.current) return

    setTokens(t)
    setSelected([])
    setCorrectAnswer(null)
    setIsAnswered(false)
    setUndoCount(0)
  }

  // 3️⃣ Handle check answer
  async function onCheck() {
    if (!sessionController || isAnswered) return

    const res = await sessionController.submitAnswer({
      userTokenIds: selected,
      correctTokenIds: [],
      timeMs: 0,
      undoCount,
    })

    setIsAnswered(true)
    setCorrectAnswer(res.correctAnswer)

    // Wait 900ms, then move on
    setTimeout(async () => {
      if (!mountedRef.current) return

      if (sessionController.isFinished()) {
        const review = await sessionController.endSession()
        router.replace({
          pathname: "./review",
          params: { review: JSON.stringify(review) },
        })
      } else if (res.correct) {
        await loadQuestion()
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
      <SessionHeader />

      <Pressable onPress={() => playAudio("sessionController.getCurrentSampleFolder()")}>
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
