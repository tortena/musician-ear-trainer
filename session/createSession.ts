import { UserProgress } from "@/domain/progression/UserProgress";
import { SessionParams } from "@/domain/session/SessionParams";
import { SessionState } from "@/domain/session/SessionState";
import { selectCardsForSession } from "@/flashcards/cardSelector";
import { loadUserProgress } from "@/storage/userProgress";

export async function createSession(sessionParams: SessionParams): Promise<SessionState> {

    const userProgress = await loadUserProgress()

    const sessionCards = selectCardsForSession(userProgress, sessionParams)

    return {
        queue: sessionCards,
        currentIndex: 0,
    
        completedFlashcards: new Array(sessionCards.length).fill(false),

        correctNum: 0,
        incorrectNum: 0,
        streak: 0,

        finished: false

    }
}