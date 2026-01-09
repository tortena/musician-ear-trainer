import { AnswerInput } from "@/domain/answer/AnswerInput";
import { AnswerResponse } from "@/domain/answer/AnswerResponse";
import { Flashcard } from "@/domain/session/Flashcard";
import { SessionParams } from "@/domain/session/SessionParams";
import { SessionState } from "@/domain/session/SessionState";
import { evaluateAnswer } from "@/flashcards/evaluateAnswer";
import { updateUserProgressFromAnswer } from "@/spacedRepetition/updateUserProgress";
import { createSession } from "./createSession";
import { getTokensForNodeFromComponent, getUnlockedTokensForModeFromComponent } from "@/utils/getTokens";
import { loadData } from "@/storage/storage";
import { loadUserProgress, saveUserProgress } from "@/storage/userProgress";
import { SKILL_COMPONENTS, SKILL_NODES } from "@/constants";
import { getNodeFromComponent } from "@/utils/hierarchy";
import { TokenId } from "@/domain/skillModel/Token";
import { UserProgress } from "@/domain/progression/UserProgress";
import { SessionStats } from "@/domain/session/SessionStats";

export class SessionController {

    private sessionState: SessionState

    private constructor(sessionState: SessionState) {
        this.sessionState = sessionState
    }

    static async start(sessionParams: SessionParams): Promise<SessionController> {
        const sessionState = await createSession(sessionParams)
        return new SessionController(sessionState)
    }

    getCurrentCard(): Flashcard | null {
        if (this.isFinished()) {
            return null
        }
        return this.sessionState.queue[this.sessionState.currentIndex]
    }

    isFinished(): boolean {
        return this.sessionState.finished
    }

    async submitAnswer(answerInput: AnswerInput): Promise<AnswerResponse> {
        const answerResponse: AnswerResponse = evaluateAnswer(answerInput)
        var userProgress: UserProgress = await loadUserProgress()
        const currentCard = this.getCurrentCard()

        if (currentCard) {
            updateUserProgressFromAnswer(
                userProgress, 
                currentCard.skillComponentId, 
                answerResponse.quality
            )
        } else {
            throw new Error("currentCard is null. Perhaps session is already finished?")
        }

        await saveUserProgress(userProgress)

        if (answerResponse.correct) {
            this.sessionState.completedFlashcards[this.sessionState.currentIndex] = true    
            this.sessionState.correctNum += 1    
        } else {
            this.sessionState.incorrectNum += 1
        }

        this.advanceSession()

        return answerResponse
    }

    private advanceSession(): void {
        var finished = true
        for (var i = 0; i <this.sessionState.queue.length; i++) {
            if (this.sessionState.completedFlashcards[i] === false) {
                finished = false
            }
        }

        this.sessionState.finished = finished


        // Find next currentIndex
        if (!finished) {
            const n = this.sessionState.queue.length

            for (var offset = 1; offset <=this.sessionState.queue.length; offset++) { 
                const i = (this.sessionState.currentIndex+offset) % n
                if (this.sessionState.completedFlashcards[i] === false) {
                    this.sessionState.currentIndex = i
                    break
                }
            }
        }
    }

    async getTokenIdsToDisplay() {
        let tokenIdsToDisplay: TokenId[]

        const currentCard = this.getCurrentCard()
        const userProgress = await loadUserProgress()

        if (currentCard) {
            const skillComponentId = currentCard.skillComponentId
            if (currentCard.newFlashcard) {
                const tokenIdsToDisplay = getTokensForNodeFromComponent(skillComponentId)
            } else {
                const tokenIdsToDisplay = getUnlockedTokensForModeFromComponent(userProgress, skillComponentId)
            }
        }
    }

    getStats(): SessionStats {
        return {
            correctNum: this.sessionState.correctNum,
            incorrectNum: this.sessionState.incorrectNum,
            streak: this.sessionState.streak

        }
    }

}