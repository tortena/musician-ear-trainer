import { Flashcard } from "./Flashcard"


// To be mutated
export type SessionState = {
   
    queue: Flashcard[]
    currentIndex: number
    practiceMode?: boolean

    completedFlashcards: Array<boolean>

    correctNum: number
    incorrectNum: number
    streak: number
    longestStreak: number

    finished: boolean
}

//src/
//├─ sessions/
//│  ├─ SessionState.ts
//│  ├─ createSession.ts
//│  ├─ getCurrentCard.ts
//│  ├─ submitAnswer.ts
//│  ├─ advanceSession.ts
//│  └─ endSession.ts
