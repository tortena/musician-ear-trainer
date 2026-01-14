import { View, Text, StyleSheet, Pressable } from "react-native"
import { useEffect, useState } from "react"
import { router } from "expo-router"
import Animated, { FadeIn } from "react-native-reanimated"

import { TokenChip } from "../../components/session/TokenChip"
import { SessionHeader } from "../../components/session/SessionHeader"
import { BottomActionBar } from "../../components/session/BottomActionBar"
import { SessionController } from "@/session/sessionController"

//import { playAudio } from "@/audio/audio"

import { DisplayToken } from "@/domain/session/DisplayToken"
import { TokenId } from "@/domain/skillModel/Token"
import { AnswerResponse } from "@/domain/answer/AnswerResponse"


export default function SessionScreen() {
  const [tokens, setTokens] = useState<DisplayToken[]>([])
  const [selected, setSelected] = useState<TokenId[]>([])
  const [correctAnswer, setCorrectAnswer] = useState<TokenId[] | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [undoCount, setUndoCount] = useState(0)
  const [sessionController, setSessionController] =
    useState<SessionController | null>(null)

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
      setTokens(t)
    }

    startSession()

    return () => {
      mounted = false
    }
  }, [])

  // 2️⃣ Loading guard (ONLY ONE)
  if (!sessionController) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "white" }}>Starting session…</Text>
      </View>
    )
  }

  // 3️⃣ Helpers
  async function loadQuestion() {
    if (!sessionController) return
    const t = await sessionController.getDisplayTokens()
    setTokens(t)
    setSelected([])
    setCorrectAnswer(null)
    setIsAnswered(false)
    setUndoCount(0)
  }

  async function onCheck() {
    if (!sessionController) return
    if (isAnswered) return

    const res = await sessionController.submitAnswer({
      userTokenIds: selected,
      correctTokenIds: [],
      timeMs: 0,
      undoCount,
    })

    setIsAnswered(true)
    setCorrectAnswer(res.correctAnswer)

    setTimeout(async () => {
      if (sessionController.isFinished()) {
        const review = await sessionController.endSession()
        router.replace({
          pathname: "./review",
          params: { review: JSON.stringify(review) },
        })
      } else if (res.correct) {
        loadQuestion()
      }
    }, 900)
  }

  function onUndo() {
    if (selected.length === 0 || isAnswered) return
    setSelected(prev => prev.slice(0, -1))
    setUndoCount(c => c + 1)
  }

  // 4️⃣ Render
  return (
    <View style={styles.container}>
      <SessionHeader />

      <Pressable onPress={() => console.log('playAudio("question")')}>
        <Text style={styles.audio}>🎧 Play sound</Text>
      </Pressable>

      {/* Selected answer */}
      <View style={styles.answerRow}>
        {selected.map((id, i) => {
          const label =
            tokens.find(t => t.tokenId === id)?.textToDisplayAsToken ?? id

          return (
            <TokenChip
              key={i}
              label={label}
              selected
              onPress={() =>
                !isAnswered &&
                setSelected(prev => prev.filter((_, idx) => idx !== i))
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
              const label =
                tokens.find(t => t.tokenId === id)?.textToDisplayAsToken ?? id
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
            onPress={() =>
              !isAnswered &&
              setSelected(prev => [...prev, token.tokenId])
            }
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
