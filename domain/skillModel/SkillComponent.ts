import { TokenId } from "./Token"

export type SkillComponentPrompt =
    | { kind: "AUDIO" }
    | { kind: "PIANO"; sourceComponentId: string }
    | { kind: "STAFF"; sourceComponentId: string; clef: "treble" | "bass" }

export type SkillComponent = {
    id: string
    tokenIds: TokenId[]
    prompt?: SkillComponentPrompt
}
