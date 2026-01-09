import { SkillComponentId } from "@/constants";
import { ComponentProgress } from "@/domain/progression/ComponentProgress";
import { UserProgress } from "@/domain/progression/UserProgress";
import { Flashcard } from "@/domain/session/Flashcard";
import { SessionParams } from "@/domain/session/SessionParams";
import { getUnlockedSkillComponentIds } from "@/logic/progression";
import { getOrCreateComponentProgress } from "@/storage/userProgress";

function chooseNewComponentIdsFromList(userProgress: UserProgress, arr: SkillComponentId[], n: number): SkillComponentId[] {
    // May want a better function than just random. Including userProgress for a potential weighting algorithm
    if (n > arr.length) {
        throw new Error("n cannot be larger than array length");
    }

    const copy: SkillComponentId[] = [...arr];

    // Fisher–Yates shuffle
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy.slice(0, n);

}

export function selectCardsForSession(userProgress: UserProgress, sessionParams: SessionParams) : Flashcard[] {
    
    // Note that current function may not have a full session of cards, and no weighting is provided for new card selection
    // Review cards are chosen via dueTime

    let {maxFlashcardNum, minNewFlashcards, maxNewFlashcards} = sessionParams

    const maxReviews = maxFlashcardNum - minNewFlashcards
    const minReviews = maxFlashcardNum - maxNewFlashcards
    
    const componentProgressList = Object.values(userProgress.componentProgress).filter(
        (p): p is ComponentProgress => p !== undefined)
    
    const now = Date.now()
    const dueComponentIds = componentProgressList.filter(
        (p): p is ComponentProgress => new Date(p.dueDate).getTime() <= now
        ).sort(
            (a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        ).map((p) => p.skillComponentId)
    
    const learntIdSet = new Set(Object.keys(userProgress.componentProgress) as SkillComponentId[])

    const newUnlockedComponentIds = getUnlockedSkillComponentIds(userProgress).filter((p) => !learntIdSet.has(p))
    
    var cardSession : Flashcard[] = []

    // Selection algorithm:
    // 1. Take as many reviewcards as possible (within given bounds)
    if (dueComponentIds.length < maxReviews) {
        cardSession.push(...(dueComponentIds.map((p): Flashcard => ({
            skillComponentId: p, 
            newFlashcard: false}))))
    } else {
        cardSession.push(...chooseNewComponentIdsFromList(
            userProgress,
            dueComponentIds,
            maxReviews).map((p): Flashcard => ({
                skillComponentId: p, 
                newFlashcard: false})))
    }


    // 2. Take as many new cards as possible (within given bounds)
    const possibleNewCards = Math.min(maxNewFlashcards,maxFlashcardNum - cardSession.length)

    if (newUnlockedComponentIds.length > possibleNewCards) {
        cardSession.push(...chooseNewComponentIdsFromList(
            userProgress,
            newUnlockedComponentIds,
            possibleNewCards).map((p): Flashcard => ({
                skillComponentId: p, 
                newFlashcard: true})))
    } else {
        cardSession.push(...(newUnlockedComponentIds.map((p): Flashcard => ({
            skillComponentId: p, 
            newFlashcard: true}))))
    }

    return cardSession

}