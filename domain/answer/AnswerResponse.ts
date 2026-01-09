import { TokenId } from "../skillModel/Token"
import { QualityScore } from "./QualityScore"

export type AnswerResponse = {
    correct: boolean,
    incorrectTokens: TokenId[],
    quality: QualityScore
}