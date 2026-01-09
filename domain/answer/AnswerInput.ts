import { ComponentProgress } from "../progression/ComponentProgress"
import { TokenId } from "../skillModel/Token"

export type AnswerInput = {
    userTokenIds: TokenId[],
    correctTokenIds: TokenId[],
    timeMs: number,
    undoCount: number
}