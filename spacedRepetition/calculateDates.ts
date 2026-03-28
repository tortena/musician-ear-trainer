import { FSRSState } from "@/domain/progression/FSRSState";

export function calculateDueDate(fsrsValues: FSRSState) {
    const now: Date = new Date()

    const dueDate = new Date(now)
    dueDate.setDate(dueDate.getDate() + fsrsValues.scheduledDays)

    return dueDate.toISOString().slice(0,10)
}

export function getDateNow() {
    return new Date().toISOString().slice(0,10)
}
