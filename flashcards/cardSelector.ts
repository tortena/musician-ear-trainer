import { SKILL_COMPONENTS, SkillComponentId } from "@/constants";
import { ComponentProgress } from "@/domain/progression/ComponentProgress";
import { UserProgress } from "@/domain/progression/UserProgress";
import { Flashcard } from "@/domain/session/Flashcard";
import { SessionParams } from "@/domain/session/SessionParams";
import { getUnlockedSkillComponentIds } from "@/logic/progression";

function isValidSkillComponentId(id: string): id is SkillComponentId {
  return id in SKILL_COMPONENTS
}

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

function appendFlashcards(
    session: Flashcard[],
    componentIds: SkillComponentId[],
    newFlashcard: boolean
) {
    session.push(...componentIds.map((skillComponentId): Flashcard => ({
        skillComponentId,
        newFlashcard,
    })))
}

function shuffleFlashcards(cards: Flashcard[]): Flashcard[] {
    const copy = [...cards]

    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }

    return copy
}

export function selectCardsForSession(userProgress: UserProgress, sessionParams: SessionParams) : Flashcard[] {
    
    // Note that current function may not have a full session of cards, and no weighting is provided for new card selection
    // Review cards are chosen via dueTime

    let {maxFlashcardNum, minNewFlashcards, maxNewFlashcards} = sessionParams

    const maxReviews = maxFlashcardNum - minNewFlashcards
    const minReviews = maxFlashcardNum - maxNewFlashcards
    
    const componentProgressList = Object.values(userProgress.componentProgresses).filter(
        (p): p is ComponentProgress => p !== undefined)
    
    const now = Date.now()
    const dueComponentIds = componentProgressList.filter(
        (p): p is ComponentProgress => new Date(p.dueDate).getTime() <= now
        ).sort(
            (a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        ).map((p) => p.skillComponentId)
    
    // Filter out any invalid skillComponentIds that may have been stored
    const learntIdSet = new Set(
      Object.keys(userProgress.componentProgresses).filter(isValidSkillComponentId)
    )

    const newUnlockedComponentIds = getUnlockedSkillComponentIds(userProgress).filter((p) => !learntIdSet.has(p))
    const unlockedLearntComponentIds = getUnlockedSkillComponentIds(userProgress).filter((p) => learntIdSet.has(p))
    
    var cardSession : Flashcard[] = []

    // Selection algorithm:
    // 1. Take as many reviewcards as possible (within given bounds)
    if (dueComponentIds.length < maxReviews) {
        appendFlashcards(cardSession, dueComponentIds, false)
    } else {
        appendFlashcards(cardSession, chooseNewComponentIdsFromList(
            userProgress,
            dueComponentIds,
            maxReviews), false)
    }


    // 2. Take as many new cards as possible (within given bounds)
    const possibleNewCards = Math.min(maxNewFlashcards,maxFlashcardNum - cardSession.length)

    if (newUnlockedComponentIds.length > possibleNewCards) {
        appendFlashcards(cardSession, chooseNewComponentIdsFromList(
            userProgress,
            newUnlockedComponentIds,
            possibleNewCards), true)
    } else {
        appendFlashcards(cardSession, newUnlockedComponentIds, true)
    }

    // 3. Fallback: if there are no due or new cards, keep the session going with unlocked learnt cards.
    const remainingSlots = maxFlashcardNum - cardSession.length
    if (remainingSlots > 0 && unlockedLearntComponentIds.length > 0) {
        const fallbackIds =
            unlockedLearntComponentIds.length > remainingSlots
                ? chooseNewComponentIdsFromList(userProgress, unlockedLearntComponentIds, remainingSlots)
                : unlockedLearntComponentIds

        appendFlashcards(cardSession, fallbackIds, false)
    }

    return shuffleFlashcards(cardSession)

}
