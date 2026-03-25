import { loadUserProgress } from "@/storage/userProgress"
import { Lock } from "lucide-react"
import { useEffect, useState } from "react"
import { Modal, Pressable, ScrollView, Text, View } from "react-native"

import { SKILL_MODES, SKILL_NODES, SKILL_TYPES } from "@/constants"
import { getUnlockedNodeIds } from "@/logic/progression"

export default function SkillTreeScreen() {
  
  const [selectedNode, setSelectedNode] = useState<any | null>(null)
  const [unlockedNodeIds, setUnlockedNodeIds] = useState<string[]>([])

  useEffect(() => {
    let mounted = true

    async function load() {
      const userProgress = await loadUserProgress()
      if (!mounted) return
      setUnlockedNodeIds(getUnlockedNodeIds(userProgress))
    }

    load()
    return () => { mounted = false }
  }, [])

  return (
    <ScrollView className="bg-black px-4 py-6">
      {Object.values(SKILL_TYPES).map((type) => (
        <View key={type.id} className="mb-10">
          <Text className="text-purple-400 text-xl font-semibold mb-4">
            {type.title}
          </Text>

          {Object.values(SKILL_MODES)
            .filter((m) => m.skillType === type.id)
            .map((mode) => (
            <View key={mode.id} className="mb-6">
              <Text className="text-purple-300 mb-3">{mode.title}</Text>

              <View className="flex-row flex-wrap">
                {Object.values(SKILL_NODES)
              .filter((n) => n.skillMode === mode.id)
              .map((node) => {
                const unlocked = unlockedNodeIds.includes(node.id)


                  return (
                    <Pressable
                      key={node.id}
                      onPress={() => unlocked && setSelectedNode(node)}
                      disabled={!unlocked}
                    >
                      <View
                        className={`w-40 h-28 m-2 rounded-2xl border items-center justify-center
                          ${unlocked
                            ? "bg-purple-900/30 border-purple-500"
                            : "bg-zinc-900 border-zinc-700"}`}
                      >
                        <Text
                          className={`text-center text-sm font-medium
                            ${unlocked ? "text-purple-200" : "text-zinc-400"}`}
                        >
                          {node.title}
                        </Text>

                        {!unlocked && (
                          <Lock size={16} className="text-zinc-500 mt-1" />
                        )}
                      </View>
                    </Pressable>


                  )
                })}
              </View>
            </View>
          ))}
        </View>
      ))}

      <Modal
        visible={!!selectedNode}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedNode(null)}
      >
        <View className="flex-1 bg-black/70 items-center justify-center px-6">
          <View className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md">
            <Text className="text-purple-300 text-lg font-semibold mb-2">
              {selectedNode?.title}
            </Text>

            {selectedNode?.description && (
              <Text className="text-zinc-400 mb-4">
                {selectedNode.description}
              </Text>
            )}

            <View className="gap-2 mb-6">
              <Text className="text-zinc-300">XP required: —</Text>
              <Text className="text-zinc-300">Level requirement: —</Text>
            </View>

            <Pressable
              onPress={() => setSelectedNode(null)}
              className="bg-purple-600 py-3 rounded-xl"
            >
              <Text className="text-center text-black font-semibold">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

