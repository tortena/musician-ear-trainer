import { SM2Values } from "@/domain/answer/SM2Response";

export function calculateDueDate(sm2Values:SM2Values) {
    const now: Date = new Date()

    const dueDate = new Date(now)
    dueDate.setDate(dueDate.getDate() + sm2Values.interval)

    return dueDate.toISOString().slice(0,10)
}

export function getDateNow() {
    return new Date().toISOString().slice(0,10)
}