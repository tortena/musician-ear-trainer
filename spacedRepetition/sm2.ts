import { QualityScore } from "@/domain/answer/QualityScore"
import { SM2Values } from "@/domain/answer/SM2Response"

const MIN_EASE = 1.3

export function getSM2Values(
    sm2Values: SM2Values,
    quality: QualityScore
): SM2Values {

    var oldRepetitions = sm2Values.repetitions
    var oldInterval = sm2Values.interval
    var oldEaseFactor = sm2Values.easeFactor

    var newRepetitions = oldRepetitions
    var newInterval = oldInterval
    var newEaseFactor = oldEaseFactor

    // SM-2 rule: quality < 3 => reset repetitions

    if (quality < 3) {
        newRepetitions = 0
        newInterval = 1
    } else {
        newRepetitions = oldRepetitions + 1

        if (newRepetitions === 1) {
            newInterval = 1
        } else if (newRepetitions === 2) {
            newInterval = 6
        } else {
            newInterval = Math.round(oldInterval * oldEaseFactor)
        }
    }

    // Update ease factor
    newEaseFactor = oldEaseFactor + (
        0.1
        - (5 - quality) * (0.08 + (5 - quality) * 0.02)
    )

    if (newEaseFactor < MIN_EASE) {
        newEaseFactor = MIN_EASE
    }

    return { 
        repetitions: newRepetitions, 
        interval: newInterval, 
        easeFactor: newEaseFactor }
}