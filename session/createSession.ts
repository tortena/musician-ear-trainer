import { SKILL_NODES, SkillNodeId } from "@/constants";
import { UserProgress } from "@/domain/progression/UserProgress";
import { SessionParams } from "@/domain/session/SessionParams";
import { SessionState } from "@/domain/session/SessionState";
import { selectCardsForSession } from "@/flashcards/cardSelector";
import { loadUserProgress } from "@/storage/userProgress";

export async function createSession(sessionParams: SessionParams): Promise<SessionState> {

    const userProgress = await loadUserProgress()
    const sessionCards =
        sessionParams.practiceNodeId && sessionParams.practiceNodeId in SKILL_NODES
            ? createPracticeSessionCards(sessionParams.practiceNodeId as SkillNodeId, sessionParams.practiceCardCount ?? 10)
            : selectCardsForSession(userProgress, sessionParams)

    return {
        queue: sessionCards,
        currentIndex: 0,
        practiceMode: Boolean(sessionParams.practiceNodeId),
    
        completedFlashcards: new Array(sessionCards.length).fill(false),

        correctNum: 0,
        incorrectNum: 0,
        streak: 0,
        longestStreak: 0,

        finished: false

    }
}

function createPracticeSessionCards(skillNodeId: SkillNodeId, cardCount: number) {
    const node = SKILL_NODES[skillNodeId]
    const components = node.skillComponentIds

    return Array.from({ length: cardCount }, (_, index) => ({
        skillComponentId: components[index % components.length],
        newFlashcard: false
    }))
}
