import { DisplayMode, SKILL_COMPONENTS, SKILL_NODES, TOKENS } from "@/constants";
import { AnswerInput } from "@/domain/answer/AnswerInput";
import { AnswerResponse } from "@/domain/answer/AnswerResponse";
import { UserProgress } from "@/domain/progression/UserProgress";
import { DisplayToken } from "@/domain/session/DisplayToken";
import { Flashcard } from "@/domain/session/Flashcard";
import { SessionParams } from "@/domain/session/SessionParams";
import { SessionReview } from "@/domain/session/SessionReview";
import { SessionState } from "@/domain/session/SessionState";
import { SessionStats } from "@/domain/session/SessionStats";
import { TokenId } from "@/domain/skillModel/Token";
import { evaluateAnswer } from "@/flashcards/evaluateAnswer";
import { getLevelForXp } from "@/logic/progression";
import { updateUserProgressFromAnswer } from "@/spacedRepetition/updateUserProgress";
import { loadUserProgress, saveUserProgress } from "@/storage/userProgress";
import { getTokensForNodeFromComponent, getUnlockedTokensForModeFromComponent } from "@/utils/getTokens";
import { getNodeFromComponent } from "@/utils/hierarchy";
import { calculateXpForComponentProgress } from "./calculateXpForComponentProgress";
import { createSession } from "./createSession";

export class SessionController {

    private sessionState: SessionState

    private constructor(sessionState: SessionState) {
        this.sessionState = sessionState
    }

    static async start(sessionParams: SessionParams): Promise<SessionController> {
        const sessionState = await createSession(sessionParams)
        return new SessionController(sessionState)
    }

    private getCurrentCard(): Flashcard {
        if (this.isFinished()) {
            throw new Error("Session is finished. Cannot get currentCard")
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
            this.sessionState.streak += 1
            this.sessionState.longestStreak = Math.max(this.sessionState.longestStreak, this.sessionState.streak)
        } else {
            this.sessionState.incorrectNum += 1
            this.sessionState.streak = 0
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

    private async getTokenIdsForCard(): Promise<TokenId[]> {
        let tokenIdsToDisplay: TokenId[]

        const currentCard = this.getCurrentCard()
        const userProgress = await loadUserProgress()

        const skillComponentId = currentCard.skillComponentId
        if (currentCard.newFlashcard) {
            tokenIdsToDisplay = getTokensForNodeFromComponent(skillComponentId)
        } else {
            tokenIdsToDisplay = getUnlockedTokensForModeFromComponent(userProgress, skillComponentId)
        }

        return tokenIdsToDisplay
    }

    async getDisplayTokens(): Promise<DisplayToken[]> {
        const tokenIds = await this.getTokenIdsForCard()
        const nodeDisplayMode: DisplayMode = SKILL_NODES[getNodeFromComponent(this.getCurrentCard().skillComponentId)].displayMode

        return tokenIds.map((id) => ({
            tokenId: id,
            textToDisplayAsToken: TOKENS[id].displayMode[nodeDisplayMode]
        }))
    }

    getStats(): SessionStats {
        return {
            correctNum: this.sessionState.correctNum,
            incorrectNum: this.sessionState.incorrectNum,
            streak: this.sessionState.streak

        }
    }

    getTotalQuestions(): number {
        return this.sessionState.queue.length
    }

    getCurrentQuestionIndex(): number {
        return this.sessionState.currentIndex
    }

    getCurrentSampleFolder() {
        return SKILL_COMPONENTS[this.getCurrentCard().skillComponentId].sampleFolder
    }

    getCorrectTokenIds(): TokenId[] {
        return SKILL_COMPONENTS[this.getCurrentCard().skillComponentId].tokenIds
    }

    async endSession(): Promise<SessionReview> {
        var userProgress: UserProgress = await loadUserProgress()
        var totalXpGained = 0

        this.sessionState.queue.forEach(
            (flashcard) => {
                const componentProgress = userProgress.componentProgresses[flashcard.skillComponentId]

                if (componentProgress) {
                    const gainedXp = calculateXpForComponentProgress(
                        componentProgress,
                        this.getStats()
                    )
                    
                    // Update Progress
                    userProgress.progression.xp += gainedXp
                    componentProgress.componentXp += gainedXp

                    totalXpGained += gainedXp

                } else {
                    throw new Error("Cannot find ComponentProgress for: " + flashcard.skillComponentId)
                }
            }
        )

        const newLevel = getLevelForXp(userProgress.progression.xp)
        const hasLeveledUp = userProgress.progression.level !== newLevel

        userProgress.progression.level = newLevel

        await saveUserProgress(userProgress)

        return {
            completedNum: this.sessionState.correctNum,
            incorrectNum: this.sessionState.incorrectNum,
            longestStreak: this.sessionState.longestStreak,
            gainedXp: totalXpGained,
            leveledUp: hasLeveledUp
        }


    }

}