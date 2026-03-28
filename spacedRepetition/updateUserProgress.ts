import { SkillComponentId } from "@/constants";
import { QualityScore } from "@/domain/answer/QualityScore";
import { UserProgress } from "@/domain/progression/UserProgress";
import { getOrCreateComponentProgress } from "@/storage/userProgress";
import { calculateDueDate, getDateNow } from "./calculateDates";
import { getFSRSValues } from "./fsrs";

export function updateUserProgressFromAnswer(
    userProgress: UserProgress,
    skillComponentId: SkillComponentId,
    quality: QualityScore
) {

    const componentProgress = getOrCreateComponentProgress(userProgress, skillComponentId)
    
    const newFSRSValues = getFSRSValues(componentProgress.fsrsValues, quality)

    componentProgress.fsrsValues = newFSRSValues

    componentProgress.dueDate = calculateDueDate(newFSRSValues)
    componentProgress.lastReviewed = getDateNow()

}
