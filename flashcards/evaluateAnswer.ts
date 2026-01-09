import { AnswerInput } from "@/domain/answer/AnswerInput";
import { AnswerResponse } from "@/domain/answer/AnswerResponse";
import { QualityScore } from "@/domain/answer/QualityScore";

const EXPECTED_TIME_PER_TOKEN_MS = 8000
const MAX_UNDOS_BEFORE_PENALTY = 1


export function evaluateAnswer(answer: AnswerInput): AnswerResponse {
    const correctSet = new Set(answer.correctTokenIds)
    const userSet = new Set(answer.userTokenIds)

    const nCorrect = [...userSet].filter(t => correctSet.has(t)).length
    const missing = correctSet.size - nCorrect
    const extra = userSet.size - nCorrect

    const timeLimitMs = EXPECTED_TIME_PER_TOKEN_MS * correctSet.size
    const timePenalty = answer.timeMs > timeLimitMs
    const undoPenalty = answer.undoCount > MAX_UNDOS_BEFORE_PENALTY

    let quality: number

    if (missing === 0 && extra === 0) quality = 5
    else if (missing === 0 && extra === 1) quality = 4
    else if (missing === 0 && extra >= 2) quality = 3
    else if (missing === 1 && extra === 0) quality = 3
    else if (missing === 1 && extra === 1) quality = 2
    else if (missing >= 2 || extra >= 3) quality = 1
    else quality = 0

    if (timePenalty) quality -= 0.5
    if (undoPenalty) quality -= 0.5

    quality = Math.max(0, Math.floor(quality))

    return {
        correct: missing === 0 && extra === 0,
        correctAnswer: [...correctSet],
        quality: quality as QualityScore
    }

}