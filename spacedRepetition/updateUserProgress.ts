import { QualityScore } from "@/domain/answer/QualityScore";
import { ComponentProgress } from "@/domain/progression/ComponentProgress";
import { getSM2Values } from "./sm2";

export function updateComponentProgressFromQuality(
    progress: ComponentProgress,
    quality: QualityScore,
    now: Date = new Date()
): void {

    const newSM2Values = getSM2Values(progress.sm2Values, quality)

    const dueDate = new Date(now)
    dueDate.setDate(dueDate.getDate() + newSM2Values.interval)

    progress.sm2Values = newSM2Values
    progress.dueDate = dueDate.toISOString().slice(0,10)


}