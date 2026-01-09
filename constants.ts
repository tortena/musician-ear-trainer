// app/constants.ts
import { SkillComponent } from "./domain/skillModel/SkillComponent"
import { SkillMode } from "./domain/skillModel/SkillMode"
import { SkillNode } from "./domain/skillModel/SkillNode"
import { SkillType } from "./domain/skillModel/SkillType"
import { Token } from "./domain/skillModel/Token"

/* ===================== NODE TYPES ===================== */
export const NODE_TYPES = ["LISTENING", "THEORY"] as const
export type NodeType = typeof NODE_TYPES[number]

/* ===================== DISPLAY MODES ===================== */

export const DISPLAY_MODES = ["DEFAULT", "SHORT"] as const
export type DisplayMode = typeof DISPLAY_MODES[number]

/* ===================== TOKENS ===================== */
/*
Tokens represent atomic answer pieces.
Answers are correct iff ALL required tokens are selected.
*/

export const TOKENS : Record<string,Token> = {
  // Qualities
  major: { id: "major", displayMode: { DEFAULT: "Major", SHORT: "M" } },
  minor: { id: "minor", displayMode: { DEFAULT: "Minor", SHORT: "m" } },
  perfect: { id: "perfect", displayMode: { DEFAULT: "Perfect", SHORT: "P" } },
  augmented: { id: "augmented", displayMode: { DEFAULT: "Augmented", SHORT: "Aug" } },
  diminished: { id: "diminished", displayMode: { DEFAULT: "Diminished", SHORT: "Dim" } },

  // Chord-only qualities
  dominant: { id: "dominant", displayMode: { DEFAULT: "Dominant", SHORT: "7" } },
  suspended: { id: "suspended", displayMode: { DEFAULT: "Suspended", SHORT: "sus" } },

  // Degrees
  second: { id: "second", displayMode: { DEFAULT: "2nd", SHORT: "2" } },
  third: { id: "third", displayMode: { DEFAULT: "3rd", SHORT: "3" } },
  fourth: { id: "fourth", displayMode: { DEFAULT: "4th", SHORT: "4" } },
  fifth: { id: "fifth", displayMode: { DEFAULT: "5th", SHORT: "5" } },
  sixth: { id: "sixth", displayMode: { DEFAULT: "6th", SHORT: "6" } },
  seventh: { id: "seventh", displayMode: { DEFAULT: "7th", SHORT: "7" } },
  octave: { id: "octave", displayMode: { DEFAULT: "Octave", SHORT: "8" } },
  ninth: { id: "ninth", displayMode: { DEFAULT: "9th", SHORT: "9" } },
  tenth: { id: "tenth", displayMode: { DEFAULT: "10th", SHORT: "10" } },
  eleventh: { id: "eleventh", displayMode: { DEFAULT: "11th", SHORT: "11" } },
  twelfth: { id: "twelfth", displayMode: { DEFAULT: "12th", SHORT: "12" } },
  thirteenth: { id: "thirteenth", displayMode: { DEFAULT: "13th", SHORT: "13" } },

  // Alterations 
  sharp5: { id: "sharp5", displayMode: { DEFAULT: "Sharp 5", SHORT: "#5" } }, 
  flat5: { id: "flat5", displayMode: { DEFAULT: "Flat 5", SHORT: "b5" } }, 
  flat9: { id: "flat9", displayMode: { DEFAULT: "Flat 9", SHORT: "b9" } }, 
  sharp9: { id: "sharp9", displayMode: { DEFAULT: "Sharp 9", SHORT: "#9" } }, 
  sharp11: { id: "sharp11", displayMode: { DEFAULT: "Sharp 11", SHORT: "#11" } }, 
  flat13: { id: "flat13", displayMode: { DEFAULT: "Flat 13", SHORT: "b13" } }, 
  sharp13: { id: "sharp13", displayMode: { DEFAULT: "Sharp 13", SHORT: "#13" } },

  add4: {id: "add4",displayMode: {DEFAULT: "add4",SHORT: "add4",}},
  add6: {id: "add6",displayMode: {DEFAULT: "add6",SHORT: "add6",}},
  add9: {id: "add9",displayMode: {DEFAULT: "add9",SHORT: "add9",}},

  // Notes (unchanged)
  C: { id: "C", displayMode: { DEFAULT: "C", SHORT: "C" } },
  "C#": { id: "C#", displayMode: { DEFAULT: "C#", SHORT: "C#" } },
  D: { id: "D", displayMode: { DEFAULT: "D", SHORT: "D" } },
  "D#": { id: "D#", displayMode: { DEFAULT: "D#", SHORT: "D#" } },
  E: { id: "E", displayMode: { DEFAULT: "E", SHORT: "E" } },
  F: { id: "F", displayMode: { DEFAULT: "F", SHORT: "F" } },
  "F#": { id: "F#", displayMode: { DEFAULT: "F#", SHORT: "F#" } },
  G: { id: "G", displayMode: { DEFAULT: "G", SHORT: "G" } },
  "G#": { id: "G#", displayMode: { DEFAULT: "G#", SHORT: "G#" } },
  A: { id: "A", displayMode: { DEFAULT: "A", SHORT: "A" } },
  "A#": { id: "A#", displayMode: { DEFAULT: "A#", SHORT: "A#" } },
  B: { id: "B", displayMode: { DEFAULT: "B", SHORT: "B" } },
} 

/* ===================== SKILL COMPONENTS ===================== */

export const SKILL_COMPONENTS = {
  /* ---------- INTERVALS ---------- */

  // 2nds
  m2_up: { id: "m2_up", tokenIds: ["minor", "second"], sampleFolder: "audio/intervals/m2_up" },
m2_down: { id: "m2_down", tokenIds: ["minor", "second"], sampleFolder: "audio/intervals/m2_down" },
m2_harmonic: { id: "m2_harmonic", tokenIds: ["minor", "second"], sampleFolder: "audio/intervals/m2_harmonic" },

M2_up: { id: "M2_up", tokenIds: ["major", "second"], sampleFolder: "audio/intervals/M2_up" },
M2_down: { id: "M2_down", tokenIds: ["major", "second"], sampleFolder: "audio/intervals/M2_down" },
M2_harmonic: { id: "M2_harmonic", tokenIds: ["major", "second"], sampleFolder: "audio/intervals/M2_harmonic" },

// 3rds
m3_up: { id: "m3_up", tokenIds: ["minor", "third"], sampleFolder: "audio/intervals/m3_up" },
m3_down: { id: "m3_down", tokenIds: ["minor", "third"], sampleFolder: "audio/intervals/m3_down" },
m3_harmonic: { id: "m3_harmonic", tokenIds: ["minor", "third"], sampleFolder: "audio/intervals/m3_harmonic" },

M3_up: { id: "M3_up", tokenIds: ["major", "third"], sampleFolder: "audio/intervals/M3_up" },
M3_down: { id: "M3_down", tokenIds: ["major", "third"], sampleFolder: "audio/intervals/M3_down" },
M3_harmonic: { id: "M3_harmonic", tokenIds: ["major", "third"], sampleFolder: "audio/intervals/M3_harmonic" },

// 4ths
P4_up: { id: "P4_up", tokenIds: ["perfect", "fourth"], sampleFolder: "audio/intervals/P4_up" },
P4_down: { id: "P4_down", tokenIds: ["perfect", "fourth"], sampleFolder: "audio/intervals/P4_down" },
P4_harmonic: { id: "P4_harmonic", tokenIds: ["perfect", "fourth"], sampleFolder: "audio/intervals/P4_harmonic" },

Aug4_up: { id: "Aug4_up", tokenIds: ["augmented", "fourth"], sampleFolder: "audio/intervals/Aug4_up" },
Aug4_down: { id: "Aug4_down", tokenIds: ["augmented", "fourth"], sampleFolder: "audio/intervals/Aug4_down" },
Aug4_harmonic: { id: "Aug4_harmonic", tokenIds: ["augmented", "fourth"], sampleFolder: "audio/intervals/Aug4_harmonic" },

Dim4_up: { id: "Dim4_up", tokenIds: ["diminished", "fourth"], sampleFolder: "audio/intervals/Dim4_up" },
Dim4_down: { id: "Dim4_down", tokenIds: ["diminished", "fourth"], sampleFolder: "audio/intervals/Dim4_down" },
Dim4_harmonic: { id: "Dim4_harmonic", tokenIds: ["diminished", "fourth"], sampleFolder: "audio/intervals/Dim4_harmonic" },

// 5ths
P5_up: { id: "P5_up", tokenIds: ["perfect", "fifth"], sampleFolder: "audio/intervals/P5_up" },
P5_down: { id: "P5_down", tokenIds: ["perfect", "fifth"], sampleFolder: "audio/intervals/P5_down" },
P5_harmonic: { id: "P5_harmonic", tokenIds: ["perfect", "fifth"], sampleFolder: "audio/intervals/P5_harmonic" },

Aug5_up: { id: "Aug5_up", tokenIds: ["augmented", "fifth"], sampleFolder: "audio/intervals/Aug5_up" },
Aug5_down: { id: "Aug5_down", tokenIds: ["augmented", "fifth"], sampleFolder: "audio/intervals/Aug5_down" },
Aug5_harmonic: { id: "Aug5_harmonic", tokenIds: ["augmented", "fifth"], sampleFolder: "audio/intervals/Aug5_harmonic" },

Dim5_up: { id: "Dim5_up", tokenIds: ["diminished", "fifth"], sampleFolder: "audio/intervals/Dim5_up" },
Dim5_down: { id: "Dim5_down", tokenIds: ["diminished", "fifth"], sampleFolder: "audio/intervals/Dim5_down" },
Dim5_harmonic: { id: "Dim5_harmonic", tokenIds: ["diminished", "fifth"], sampleFolder: "audio/intervals/Dim5_harmonic" },

// 6ths
m6_up: { id: "m6_up", tokenIds: ["minor", "sixth"], sampleFolder: "audio/intervals/m6_up" },
m6_down: { id: "m6_down", tokenIds: ["minor", "sixth"], sampleFolder: "audio/intervals/m6_down" },
m6_harmonic: { id: "m6_harmonic", tokenIds: ["minor", "sixth"], sampleFolder: "audio/intervals/m6_harmonic" },

M6_up: { id: "M6_up", tokenIds: ["major", "sixth"], sampleFolder: "audio/intervals/M6_up" },
M6_down: { id: "M6_down", tokenIds: ["major", "sixth"], sampleFolder: "audio/intervals/M6_down" },
M6_harmonic: { id: "M6_harmonic", tokenIds: ["major", "sixth"], sampleFolder: "audio/intervals/M6_harmonic" },

// 7ths
m7_up: { id: "m7_up", tokenIds: ["minor", "seventh"], sampleFolder: "audio/intervals/m7_up" },
m7_down: { id: "m7_down", tokenIds: ["minor", "seventh"], sampleFolder: "audio/intervals/m7_down" },
m7_harmonic: { id: "m7_harmonic", tokenIds: ["minor", "seventh"], sampleFolder: "audio/intervals/m7_harmonic" },

M7_up: { id: "M7_up", tokenIds: ["major", "seventh"], sampleFolder: "audio/intervals/M7_up" },
M7_down: { id: "M7_down", tokenIds: ["major", "seventh"], sampleFolder: "audio/intervals/M7_down" },
M7_harmonic: { id: "M7_harmonic", tokenIds: ["major", "seventh"], sampleFolder: "audio/intervals/M7_harmonic" },

// Octave
P8_up: { id: "P8_up", tokenIds: ["perfect", "octave"], sampleFolder: "audio/intervals/P8_up" },
P8_down: { id: "P8_down", tokenIds: ["perfect", "octave"], sampleFolder: "audio/intervals/P8_down" },
P8_harmonic: { id: "P8_harmonic", tokenIds: ["perfect", "octave"], sampleFolder: "audio/intervals/P8_harmonic" },

// 9ths
m9_up: { id: "m9_up", tokenIds: ["minor", "ninth"], sampleFolder: "audio/intervals/m9_up" },
m9_down: { id: "m9_down", tokenIds: ["minor", "ninth"], sampleFolder: "audio/intervals/m9_down" },
m9_harmonic: { id: "m9_harmonic", tokenIds: ["minor", "ninth"], sampleFolder: "audio/intervals/m9_harmonic" },

M9_up: { id: "M9_up", tokenIds: ["major", "ninth"], sampleFolder: "audio/intervals/M9_up" },
M9_down: { id: "M9_down", tokenIds: ["major", "ninth"], sampleFolder: "audio/intervals/M9_down" },
M9_harmonic: { id: "M9_harmonic", tokenIds: ["major", "ninth"], sampleFolder: "audio/intervals/M9_harmonic" },

// 10ths
m10_up: { id: "m10_up", tokenIds: ["minor", "tenth"], sampleFolder: "audio/intervals/m10_up" },
m10_down: { id: "m10_down", tokenIds: ["minor", "tenth"], sampleFolder: "audio/intervals/m10_down" },
m10_harmonic: { id: "m10_harmonic", tokenIds: ["minor", "tenth"], sampleFolder: "audio/intervals/m10_harmonic" },

M10_up: { id: "M10_up", tokenIds: ["major", "tenth"], sampleFolder: "audio/intervals/M10_up" },
M10_down: { id: "M10_down", tokenIds: ["major", "tenth"], sampleFolder: "audio/intervals/M10_down" },
M10_harmonic: { id: "M10_harmonic", tokenIds: ["major", "tenth"], sampleFolder: "audio/intervals/M10_harmonic" },

// 11ths
P11_up: { id: "P11_up", tokenIds: ["perfect", "eleventh"], sampleFolder: "audio/intervals/P11_up" },
P11_down: { id: "P11_down", tokenIds: ["perfect", "eleventh"], sampleFolder: "audio/intervals/P11_down" },
P11_harmonic: { id: "P11_harmonic", tokenIds: ["perfect", "eleventh"], sampleFolder: "audio/intervals/P11_harmonic" },

Aug11_up: { id: "Aug11_up", tokenIds: ["augmented", "eleventh"], sampleFolder: "audio/intervals/Aug11_up" },
Aug11_down: { id: "Aug11_down", tokenIds: ["augmented", "eleventh"], sampleFolder: "audio/intervals/Aug11_down" },
Aug11_harmonic: { id: "Aug11_harmonic", tokenIds: ["augmented", "eleventh"], sampleFolder: "audio/intervals/Aug11_harmonic" },

// 12ths
P12_up: { id: "P12_up", tokenIds: ["perfect", "twelfth"], sampleFolder: "audio/intervals/P12_up" },
P12_down: { id: "P12_down", tokenIds: ["perfect", "twelfth"], sampleFolder: "audio/intervals/P12_down" },
P12_harmonic: { id: "P12_harmonic", tokenIds: ["perfect", "twelfth"], sampleFolder: "audio/intervals/P12_harmonic" },

Aug12_up: { id: "Aug12_up", tokenIds: ["augmented", "twelfth"], sampleFolder: "audio/intervals/Aug12_up" },
Aug12_down: { id: "Aug12_down", tokenIds: ["augmented", "twelfth"], sampleFolder: "audio/intervals/Aug12_down" },
Aug12_harmonic: { id: "Aug12_harmonic", tokenIds: ["augmented", "twelfth"], sampleFolder: "audio/intervals/Aug12_harmonic" },

// 13ths
P13_up: { id: "P13_up", tokenIds: ["perfect", "thirteenth"], sampleFolder: "audio/intervals/P13_up" },
P13_down: { id: "P13_down", tokenIds: ["perfect", "thirteenth"], sampleFolder: "audio/intervals/P13_down" },
P13_harmonic: { id: "P13_harmonic", tokenIds: ["perfect", "thirteenth"], sampleFolder: "audio/intervals/P13_harmonic" },

Aug13_up: { id: "Aug13_up", tokenIds: ["augmented", "thirteenth"], sampleFolder: "audio/intervals/Aug13_up" },
Aug13_down: { id: "Aug13_down", tokenIds: ["augmented", "thirteenth"], sampleFolder: "audio/intervals/Aug13_down" },
Aug13_harmonic: { id: "Aug13_harmonic", tokenIds: ["augmented", "thirteenth"], sampleFolder: "audio/intervals/Aug13_harmonic" },



  /* ---------- CHORDS ---------- */


  // ===== Triads & basic =====
  maj: {
    id: "maj",
    tokenIds: ["major"],
    sampleFolder: "audio/chords/maj",
  },

  min: {
    id: "min",
    tokenIds: ["minor"],
    sampleFolder: "audio/chords/min",
  },

  aug: {
    id: "aug",
    tokenIds: ["augmented"],
    sampleFolder: "audio/chords/aug",
  },

  dim: {
    id: "dim",
    tokenIds: ["diminished"],
    sampleFolder: "audio/chords/dim",
  },

  power: {
    id: "power",
    tokenIds: ["power"],
    sampleFolder: "audio/chords/power",
  },

  sus2: {
    id: "sus2",
    tokenIds: ["suspended", "second"],
    sampleFolder: "audio/chords/sus2",
  },

  sus4: {
    id: "sus4",
    tokenIds: ["suspended", "fourth"],
    sampleFolder: "audio/chords/sus4",
  },

  // ===== Dominant =====
  dom7: {
    id: "dom7",
    tokenIds: ["dominant", "seventh"],
    sampleFolder: "audio/chords/dom7",
  },

  dom7b5: {
    id: "dom7b5",
    tokenIds: ["dominant", "seventh", "flat5"],
    sampleFolder: "audio/chords/dom7b5",
  },

  "dom7#5": {
    id: "dom7#5",
    tokenIds: ["dominant", "seventh", "sharp5"],
    sampleFolder: "audio/chords/dom7#5",
  },

  dom7b9: {
    id: "dom7b9",
    tokenIds: ["dominant", "seventh", "flat9"],
    sampleFolder: "audio/chords/dom7b9",
  },

  "dom7#9": {
    id: "dom7#9",
    tokenIds: ["dominant", "seventh", "sharp9"],
    sampleFolder: "audio/chords/dom7#9",
  },

  dom7sus4: {
    id: "dom7sus4",
    tokenIds: ["dominant", "seventh", "suspended", "fourth"],
    sampleFolder: "audio/chords/dom7sus4",
  },

  dom9: {
    id: "dom9",
    tokenIds: ["dominant", "ninth"],
    sampleFolder: "audio/chords/dom9",
  },

  dom11: {
    id: "dom11",
    tokenIds: ["dominant", "eleventh"],
    sampleFolder: "audio/chords/dom11",
  },

  dom13: {
    id: "dom13",
    tokenIds: ["dominant", "thirteenth"],
    sampleFolder: "audio/chords/dom13",
  },

  // ===== Minor =====
  m7: {
    id: "m7",
    tokenIds: ["minor", "seventh"],
    sampleFolder: "audio/chords/m7",
  },

  m7b5: {
    id: "m7b5",
    tokenIds: ["minor", "seventh", "flat5"],
    sampleFolder: "audio/chords/m7b5",
  },

  m9: {
    id: "m9",
    tokenIds: ["minor", "ninth"],
    sampleFolder: "audio/chords/m9",
  },

  m11: {
    id: "m11",
    tokenIds: ["minor", "eleventh"],
    sampleFolder: "audio/chords/m11",
  },

  m13: {
    id: "m13",
    tokenIds: ["minor", "thirteenth"],
    sampleFolder: "audio/chords/m13",
  },

  m6_9: {
    id: "m6_9",
    tokenIds: ["minor", "sixth", "ninth"],
    sampleFolder: "audio/chords/m6_9",
  },

  mMaj7: {
    id: "mMaj7",
    tokenIds: ["minor", "major", "seventh"],
    sampleFolder: "audio/chords/mMaj7",
  },

  mMaj9: {
    id: "mMaj9",
    tokenIds: ["minor", "major", "ninth"],
    sampleFolder: "audio/chords/mMaj9",
  },

  // ===== Major =====
  maj7: {
    id: "maj7",
    tokenIds: ["major", "seventh"],
    sampleFolder: "audio/chords/maj7",
  },

  "maj7#5": {
    id: "maj7#5",
    tokenIds: ["major", "seventh", "sharp5"],
    sampleFolder: "audio/chords/maj7#5",
  },

  maj9: {
    id: "maj9",
    tokenIds: ["major", "ninth"],
    sampleFolder: "audio/chords/maj9",
  },

  "maj9#11": {
    id: "maj9#11",
    tokenIds: ["major", "ninth", "sharp11"],
    sampleFolder: "audio/chords/maj9#11",
  },

  maj11: {
    id: "maj11",
    tokenIds: ["major", "eleventh"],
    sampleFolder: "audio/chords/maj11",
  },

  maj13: {
    id: "maj13",
    tokenIds: ["major", "thirteenth"],
    sampleFolder: "audio/chords/maj13",
  },

  "maj13#11": {
    id: "maj13#11",
    tokenIds: ["major", "thirteenth", "sharp11"],
    sampleFolder: "audio/chords/maj13#11",
  },

  maj6_9: {
    id: "maj6_9",
    tokenIds: ["major", "sixth", "ninth"],
    sampleFolder: "audio/chords/maj6_9",
  },

  // ===== Added-tone =====
  majadd4: {
    id: "majadd4",
    tokenIds: ["major", "add4"],
    sampleFolder: "audio/chords/majadd4",
  },

  majadd6: {
    id: "majadd6",
    tokenIds: ["major", "add6"],
    sampleFolder: "audio/chords/majadd6",
  },

  majadd9: {
    id: "majadd9",
    tokenIds: ["major", "add9"],
    sampleFolder: "audio/chords/majadd9",
  },

  minadd4: {
    id: "minadd4",
    tokenIds: ["minor", "add4"],
    sampleFolder: "audio/chords/minadd4",
  },

  minadd6: {
    id: "minadd6",
    tokenIds: ["minor", "add6"],
    sampleFolder: "audio/chords/minadd6",
  },

  minadd9: {
    id: "minadd9",
    tokenIds: ["minor", "add9"],
    sampleFolder: "audio/chords/minadd9",
  },

  // ===== Fully diminished =====
  dim7: {
    id: "dim7",
    tokenIds: ["diminished", "seventh"],
    sampleFolder: "audio/chords/dim7",
  },

    // Dominant 13th variations

    dom13b9: {
    id: "dom13b9",
    tokenIds: ["dominant", "thirteenth", "flat9"],
    sampleFolder: "audio/chords/dom13b9",
    },
    "dom13#9": {
    id: "dom13#9",
    tokenIds: ["dominant", "thirteenth", "sharp9"],
    sampleFolder: "audio/chords/dom13#9",
    },

    "dom13#11": {
    id: "dom13#11",
    tokenIds: ["dominant", "thirteenth", "sharp11"],
    sampleFolder: "audio/chords/dom13#11",
    },
    dom13b5: {
    id: "dom13b5",
    tokenIds: ["dominant", "thirteenth", "flat5"],
    sampleFolder: "audio/chords/dom13b5",
    },
    "dom13#5": {
    id: "dom13#5",
    tokenIds: ["dominant", "thirteenth", "augmented"],
    sampleFolder: "audio/chords/dom13#5",
    },

    "dom7#13": {
    id: "dom7#13",
    tokenIds: ["dominant", "seventh", "sharp13"],
    sampleFolder: "audio/chords/dom7#13",
    },


  /* ---------- NOTES ---------- */

  note_C: { id: "note_C", tokenIds: ["C"], sampleFolder: "audio/notes/C" },
  note_Cs: { id: "note_C#", tokenIds: ["C#"], sampleFolder: "audio/notes/C#" },
  note_D: { id: "note_D", tokenIds: ["D"], sampleFolder: "audio/notes/D" },
  note_Ds: { id: "note_D#", tokenIds: ["D#"], sampleFolder: "audio/notes/D#" },
  note_E: { id: "note_E", tokenIds: ["E"], sampleFolder: "audio/notes/E" },
  note_F: { id: "note_F", tokenIds: ["F"], sampleFolder: "audio/notes/F" },
  note_Fs: { id: "note_F#", tokenIds: ["F#"], sampleFolder: "audio/notes/F#" },
  note_G: { id: "note_G", tokenIds: ["G"], sampleFolder: "audio/notes/G" },
  note_Gs: { id: "note_G#", tokenIds: ["G#"], sampleFolder: "audio/notes/G#" },
  note_A: { id: "note_A", tokenIds: ["A"], sampleFolder: "audio/notes/A" },
  note_As: { id: "note_A#", tokenIds: ["A#"], sampleFolder: "audio/notes/A#" },
  note_B: { id: "note_B", tokenIds: ["B"], sampleFolder: "audio/notes/B" },
} as const satisfies Record<string, SkillComponent>

export type SkillComponentId = keyof typeof SKILL_COMPONENTS


export const SKILL_NODES = {
  //----------- ASCENDING INTERVALS ------------
  asc_2nds: {
    id: "asc_2nds",
    title: "Ascending 2nds",
    skillComponentIds: ["m2_up", "M2_up"],
    skillMode: "ascending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  asc_3rds: {
    id: "asc_3rds",
    title: "Ascending 3rds",
    skillComponentIds: ["m3_up", "M3_up"],
    skillMode: "ascending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  asc_4ths: {
    id: "asc_4ths",
    title: "Ascending 4ths",
    skillComponentIds: ["P4_up", "Aug4_up", "Dim4_up"],
    skillMode: "ascending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  asc_5ths: {
    id: "asc_5ths",
    title: "Ascending 5ths",
    skillComponentIds: ["P5_up", "Aug5_up", "Dim5_up"],
    skillMode: "ascending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  asc_octave: {
    id: "asc_octave",
    title: "Ascending Octave",
    skillComponentIds: ["P8_up"],
    skillMode: "ascending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  asc_6ths: {
    id: "asc_6ths",
    title: "Ascending 6ths",
    skillComponentIds: ["m6_up", "M6_up"],
    skillMode: "ascending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  asc_7ths: {
    id: "asc_7ths",
    title: "Ascending 7ths",
    skillComponentIds: ["m7_up", "M7_up"],
    skillMode: "ascending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  asc_9ths: {
    id: "asc_9ths",
    title: "Ascending 9ths",
    skillComponentIds: ["m9_up", "M9_up"],
    skillMode: "ascending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  asc_10_11: {
    id: "asc_10_11",
    title: "Ascending 10ths & 11ths",
    skillComponentIds: ["m10_up", "M10_up", "P11_up", "Aug11_up"],
    skillMode: "ascending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  asc_12_13: {
    id: "asc_12_13",
    title: "Ascending 12ths & 13ths",
    skillComponentIds: ["P12_up", "Aug12_up", "P13_up", "Aug13_up"],
    skillMode: "ascending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },

  //----------- DESCENDING INTERVALS ------------
  desc_2nds: {
    id: "desc_2nds",
    title: "Descending 2nds",
    skillComponentIds: ["m2_down", "M2_down"],
    skillMode: "descending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  desc_3rds: {
    id: "desc_3rds",
    title: "Descending 3rds",
    skillComponentIds: ["m3_down", "M3_down"],
    skillMode: "descending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  desc_4ths: {
    id: "desc_4ths",
    title: "Descending 4ths",
    skillComponentIds: ["P4_down", "Aug4_down", "Dim4_down"],
    skillMode: "descending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  desc_5ths: {
    id: "desc_5ths",
    title: "Descending 5ths",
    skillComponentIds: ["P5_down", "Aug5_down", "Dim5_down"],
    skillMode: "descending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  desc_octave: {
    id: "desc_octave",
    title: "Descending Octave",
    skillComponentIds: ["P8_down"],
    skillMode: "descending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  desc_6ths: {
    id: "desc_6ths",
    title: "Descending 6ths",
    skillComponentIds: ["m6_down", "M6_down"],
    skillMode: "descending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  desc_7ths: {
    id: "desc_7ths",
    title: "Descending 7ths",
    skillComponentIds: ["m7_down", "M7_down"],
    skillMode: "descending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  desc_9ths: {
    id: "desc_9ths",
    title: "Descending 9ths",
    skillComponentIds: ["m9_down", "M9_down"],
    skillMode: "descending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  desc_10_11: {
    id: "desc_10_11",
    title: "Descending 10ths & 11ths",
    skillComponentIds: ["m10_down", "M10_down", "P11_down", "Aug11_down"],
    skillMode: "descending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  desc_12_13: {
    id: "desc_12_13",
    title: "Descending 12ths & 13ths",
    skillComponentIds: ["P12_down", "Aug12_down", "P13_down", "Aug13_down"],
    skillMode: "descending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },

  //----------- HARMONIC INTERVALS ------------
  harmonic_2nds: {
    id: "harmonic_2nds",
    title: "Harmonic 2nds",
    skillComponentIds: ["m2_harmonic", "M2_harmonic"],
    skillMode: "harmonic_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  harmonic_3rds: {
    id: "harmonic_3rds",
    title: "Harmonic 3rds",
    skillComponentIds: ["m3_harmonic", "M3_harmonic"],
    skillMode: "harmonic_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  harmonic_4ths: {
    id: "harmonic_4ths",
    title: "Harmonic 4ths",
    skillComponentIds: ["P4_harmonic", "Aug4_harmonic", "Dim4_harmonic"],
    skillMode: "harmonic_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  harmonic_5ths: {
    id: "harmonic_5ths",
    title: "Harmonic 5ths",
    skillComponentIds: ["P5_harmonic", "Aug5_harmonic", "Dim5_harmonic"],
    skillMode: "harmonic_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  harmonic_octave: {
    id: "harmonic_octave",
    title: "Harmonic Octave",
    skillComponentIds: ["P8_harmonic"],
    skillMode: "harmonic_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  harmonic_6ths: {
    id: "harmonic_6ths",
    title: "Harmonic 6ths",
    skillComponentIds: ["m6_harmonic", "M6_harmonic"],
    skillMode: "harmonic_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  harmonic_7ths: {
    id: "harmonic_7ths",
    title: "Harmonic 7ths",
    skillComponentIds: ["m7_harmonic", "M7_harmonic"],
    skillMode: "harmonic_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  harmonic_9ths: {
    id: "harmonic_9ths",
    title: "Harmonic 9ths",
    skillComponentIds: ["m9_harmonic", "M9_harmonic"],
    skillMode: "harmonic_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  harmonic_10_11: {
    id: "harmonic_10_11",
    title: "Harmonic 10ths & 11ths",
    skillComponentIds: ["m10_harmonic", "M10_harmonic", "P11_harmonic", "Aug11_harmonic"],
    skillMode: "harmonic_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  harmonic_12_13: {
    id: "harmonic_12_13",
    title: "Harmonic 12ths & 13ths",
    skillComponentIds: ["P12_harmonic", "Aug12_harmonic", "P13_harmonic", "Aug13_harmonic"],
    skillMode: "harmonic_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },

  //----------- CHORDS ------------
  chord_triads: {
    id: "chord_triads",
    title: "Basic Triads",
    skillComponentIds: ["maj", "min", "dim", "aug"],
    skillMode: "chords",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  chord_sus_power: {
    id: "chord_sus_power",
    title: "Suspended & Power Chords",
    skillComponentIds: ["sus2", "sus4", "power"],
    skillMode: "chords",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  chord_major_minor_7: {
    id: "chord_major_minor_7",
    title: "Major & Minor 7ths",
    skillComponentIds: ["maj7", "m7", "mMaj7"],
    skillMode: "chords",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  chord_dom_dim_7: {
    id: "chord_dom_dim_7",
    title: "Dominant & Diminished 7ths",
    skillComponentIds: ["dom7", "m7b5", "dim7"],
    skillMode: "chords",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  chord_9ths: {
    id: "chord_9ths",
    title: "9th Chords",
    skillComponentIds: ["maj9", "m9", "dom9"],
    skillMode: "chords",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  chord_11_69: {
    id: "chord_11_69",
    title: "11ths & 6/9 Chords",
    skillComponentIds: ["maj11", "m11", "maj6_9", "m6_9"],
    skillMode: "chords",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  chord_13ths: {
    id: "chord_13ths",
    title: "13th Chords",
    skillComponentIds: ["maj13", "m13", "dom13"],
    skillMode: "chords",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  chord_added: {
    id: "chord_added",
    title: "Added-Tone Chords",
    skillComponentIds: [
      "majadd4","majadd6","majadd9",
      "minadd4","minadd6","minadd9"
    ],
    skillMode: "chords",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  chord_altered_7: {
    id: "chord_altered_7",
    title: "Altered Dominant 7ths",
    skillComponentIds: [
      "dom7b5","dom7#5","dom7b9","dom7#9","dom7sus4","dom7#13"
    ],
    skillMode: "chords",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  chord_altered_13: {
    id: "chord_altered_13",
    title: "Altered Dominant 13ths",
    skillComponentIds: [
      "dom13b9","dom13#9","dom13#11","dom13b5","dom13#5"
    ],
    skillMode: "chords",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },

  //----------- NOTES ------------
  notes_white_1: {
    id: "notes_white_1",
    title: "White Notes (C–E)",
    skillComponentIds: ["note_C", "note_D", "note_E"],
    skillMode: "notes",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  notes_white_2: {
    id: "notes_white_2",
    title: "White Notes (F–B)",
    skillComponentIds: ["note_F", "note_G", "note_A", "note_B"],
    skillMode: "notes",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  notes_black_1: {
    id: "notes_black_1",
    title: "Black Notes (Group 1)",
    skillComponentIds: ["note_Cs", "note_Ds"],
    skillMode: "notes",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  notes_black_2: {
    id: "notes_black_2",
    title: "Black Notes (Group 2)",
    skillComponentIds: ["note_Fs", "note_Gs", "note_As"],
    skillMode: "notes",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
} as const satisfies Record<string, SkillNode>;

export type SkillNodeId = keyof typeof SKILL_NODES


export const SKILL_MODES = {
  ascending_intervals: {
    id: "ascending_intervals",
    title: "Ascending Intervals",
    levelRequirement: 1,
    skillType: "intervals",
    stages: [
      { xpRequirement: 0, skillNodeIds: ["asc_2nds", "asc_3rds"] },
      { xpRequirement: 15, skillNodeIds: ["asc_4ths", "asc_5ths"] },
      { xpRequirement: 30, skillNodeIds: ["asc_octave"] },
      { xpRequirement: 45, skillNodeIds: ["asc_6ths", "asc_7ths"] },
      { xpRequirement: 65, skillNodeIds: ["asc_9ths"] },
      { xpRequirement: 80, skillNodeIds: ["asc_10_11"] },
      { xpRequirement: 100, skillNodeIds: ["asc_12_13"] },
    ],
  },

  descending_intervals: {
    id: "descending_intervals",
    title: "Descending Intervals",
    levelRequirement: 1,
    skillType: "intervals",
    stages: [
      { xpRequirement: 0, skillNodeIds: ["desc_2nds", "desc_3rds"] },
      { xpRequirement: 15, skillNodeIds: ["desc_4ths", "desc_5ths"] },
      { xpRequirement: 30, skillNodeIds: ["desc_octave"] },
      { xpRequirement: 45, skillNodeIds: ["desc_6ths", "desc_7ths"] },
      { xpRequirement: 65, skillNodeIds: ["desc_9ths"] },
      { xpRequirement: 80, skillNodeIds: ["desc_10_11"] },
      { xpRequirement: 100, skillNodeIds: ["desc_12_13"] },
    ],
  },

  harmonic_intervals: {
    id: "harmonic_intervals",
    title: "Harmonic Intervals",
    levelRequirement: 1,
    skillType: "intervals",
    stages: [
      { xpRequirement: 0, skillNodeIds: ["harmonic_2nds", "harmonic_3rds"] },
      { xpRequirement: 15, skillNodeIds: ["harmonic_4ths", "harmonic_5ths"] },
      { xpRequirement: 30, skillNodeIds: ["harmonic_octave"] },
      { xpRequirement: 45, skillNodeIds: ["harmonic_6ths", "harmonic_7ths"] },
      { xpRequirement: 65, skillNodeIds: ["harmonic_9ths"] },
      { xpRequirement: 80, skillNodeIds: ["harmonic_10_11"] },
      { xpRequirement: 100, skillNodeIds: ["harmonic_12_13"] },
    ],
  },

  chords: {
    id: "chords",
    title: "Chord Recognition",
    levelRequirement: 5,
    skillType: "chords",
    stages: [
      { xpRequirement: 0, skillNodeIds: ["chord_triads", "chord_sus_power"] },
      { xpRequirement: 25, skillNodeIds: ["chord_major_minor_7"] },
      { xpRequirement: 45, skillNodeIds: ["chord_dom_dim_7"] },
      { xpRequirement: 65, skillNodeIds: ["chord_9ths"] },
      { xpRequirement: 85, skillNodeIds: ["chord_11_69"] },
      { xpRequirement: 105, skillNodeIds: ["chord_13ths"] },
      { xpRequirement: 130, skillNodeIds: ["chord_added"] },
      { xpRequirement: 160, skillNodeIds: ["chord_altered_7"] },
      { xpRequirement: 200, skillNodeIds: ["chord_altered_13"] },
    ],
  },

  notes: {
    id: "notes",
    title: "Note Recognition",
    levelRequirement: 1,
    skillType: "notes",
    stages: [
      { xpRequirement: 0, skillNodeIds: ["notes_white_1"] },
      { xpRequirement: 10, skillNodeIds: ["notes_white_2"] },
      { xpRequirement: 25, skillNodeIds: ["notes_black_1"] },
      { xpRequirement: 40, skillNodeIds: ["notes_black_2"] },
    ],
  },

} as const satisfies Record<string, SkillMode>

export type SkillModeId = keyof typeof SKILL_MODES

export const SKILL_TYPES = {
    intervals: {
        id: "intervals",
        title: "Intervals"
    },

    notes: {
        id: "notes",
        title: "Notes"
    },

    chords: {
        id: "chords",
        title: "Chords"
    }
} as const satisfies Record<string, SkillType>

export type SkillTypeId = keyof typeof SKILL_TYPES

export const LEVELS_FROM_XP = {
  1: 0,
  2: 100,
  3: 300,
  4: 600,
  5: 1000,
  6: 1500
}
