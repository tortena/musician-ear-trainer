import { SkillComponentId } from "@/constants";
import { QualityScore } from "@/domain/answer/QualityScore";
import { UserProgress } from "@/domain/progression/UserProgress";
import { getOrCreateComponentProgress } from "@/storage/userProgress";
import { calculateDueDate, getDateNow } from "./calculateDates";
import { getSM2Values } from "./sm2";

export function updateUserProgressFromAnswer(
    userProgress: UserProgress,
    skillComponentId: SkillComponentId,
    quality: QualityScore
) {

    const componentProgress = getOrCreateComponentProgress(userProgress, skillComponentId)
    
    const newSM2Values = getSM2Values(componentProgress.sm2Values, quality)

    componentProgress.sm2Values = newSM2Values

    componentProgress.dueDate = calculateDueDate(newSM2Values)
    componentProgress.lastReviewed = getDateNow()

}