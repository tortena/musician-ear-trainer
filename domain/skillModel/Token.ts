import { DisplayMode } from "@/constants"

export type TokenId = string

export type DisplayByMode = Record<DisplayMode, string>

export type Token = {
    id: string
    displayMode: DisplayByMode
}