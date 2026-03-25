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
  m2_up: { id: "m2_up", tokenIds: ["minor", "second"] },
  m2_down: { id: "m2_down", tokenIds: ["minor", "second"] },
  m2_harmonic: { id: "m2_harmonic", tokenIds: ["minor", "second"] },

  Maj2_up: { id: "Maj2_up", tokenIds: ["major", "second"] },
  Maj2_down: { id: "Maj2_down", tokenIds: ["major", "second"] },
  Maj2_harmonic: { id: "Maj2_harmonic", tokenIds: ["major", "second"] },

  // 3rds
  m3_up: { id: "m3_up", tokenIds: ["minor", "third"] },
  m3_down: { id: "m3_down", tokenIds: ["minor", "third"] },
  m3_harmonic: { id: "m3_harmonic", tokenIds: ["minor", "third"] },

  Maj3_up: { id: "Maj3_up", tokenIds: ["major", "third"] },
  Maj3_down: { id: "Maj3_down", tokenIds: ["major", "third"] },
  Maj3_harmonic: { id: "Maj3_harmonic", tokenIds: ["major", "third"] },

  // 4ths
  P4_up: { id: "P4_up", tokenIds: ["perfect", "fourth"] },
  P4_down: { id: "P4_down", tokenIds: ["perfect", "fourth"] },
  P4_harmonic: { id: "P4_harmonic", tokenIds: ["perfect", "fourth"] },

  // 5ths
  P5_up: { id: "P5_up", tokenIds: ["perfect", "fifth"] },
  P5_down: { id: "P5_down", tokenIds: ["perfect", "fifth"] },
  P5_harmonic: { id: "P5_harmonic", tokenIds: ["perfect", "fifth"] },

  Dim5_up: { id: "Dim5_up", tokenIds: ["diminished", "fifth"] },
  Dim5_down: { id: "Dim5_down", tokenIds: ["diminished", "fifth"] },
  Dim5_harmonic: { id: "Dim5_harmonic", tokenIds: ["diminished", "fifth"] },

  // 6ths
  m6_up: { id: "m6_up", tokenIds: ["minor", "sixth"] },
  m6_down: { id: "m6_down", tokenIds: ["minor", "sixth"] },
  m6_harmonic: { id: "m6_harmonic", tokenIds: ["minor", "sixth"] },

  Maj6_up: { id: "Maj6_up", tokenIds: ["major", "sixth"] },
  Maj6_down: { id: "Maj6_down", tokenIds: ["major", "sixth"] },
  Maj6_harmonic: { id: "Maj6_harmonic", tokenIds: ["major", "sixth"] },

  // 7ths
  m7_up: { id: "m7_up", tokenIds: ["minor", "seventh"] },
  m7_down: { id: "m7_down", tokenIds: ["minor", "seventh"] },
  m7_harmonic: { id: "m7_harmonic", tokenIds: ["minor", "seventh"] },

  Maj7_up: { id: "Maj7_up", tokenIds: ["major", "seventh"] },
  Maj7_down: { id: "Maj7_down", tokenIds: ["major", "seventh"] },
  Maj7_harmonic: { id: "Maj7_harmonic", tokenIds: ["major", "seventh"] },

  // Octave
  P8_up: { id: "P8_up", tokenIds: ["perfect", "octave"] },
  P8_down: { id: "P8_down", tokenIds: ["perfect", "octave"] },
  P8_harmonic: { id: "P8_harmonic", tokenIds: ["perfect", "octave"] },

  // 9ths
  m9_up: { id: "m9_up", tokenIds: ["minor", "ninth"] },
  m9_down: { id: "m9_down", tokenIds: ["minor", "ninth"] },
  m9_harmonic: { id: "m9_harmonic", tokenIds: ["minor", "ninth"] },

  Maj9_up: { id: "Maj9_up", tokenIds: ["major", "ninth"] },
  Maj9_down: { id: "Maj9_down", tokenIds: ["major", "ninth"] },
  Maj9_harmonic: { id: "Maj9_harmonic", tokenIds: ["major", "ninth"] },

  // 10ths
  m10_up: { id: "m10_up", tokenIds: ["minor", "tenth"] },
  m10_down: { id: "m10_down", tokenIds: ["minor", "tenth"] },
  m10_harmonic: { id: "m10_harmonic", tokenIds: ["minor", "tenth"] },

  Maj10_up: { id: "Maj10_up", tokenIds: ["major", "tenth"] },
  Maj10_down: { id: "Maj10_down", tokenIds: ["major", "tenth"] },
  Maj10_harmonic: { id: "Maj10_harmonic", tokenIds: ["major", "tenth"] },

  // 11ths
  P11_up: { id: "P11_up", tokenIds: ["perfect", "eleventh"] },
  P11_down: { id: "P11_down", tokenIds: ["perfect", "eleventh"] },
  P11_harmonic: { id: "P11_harmonic", tokenIds: ["perfect", "eleventh"] },

  Aug11_up: { id: "Aug11_up", tokenIds: ["augmented", "eleventh"] },
  Aug11_down: { id: "Aug11_down", tokenIds: ["augmented", "eleventh"] },
  Aug11_harmonic: { id: "Aug11_harmonic", tokenIds: ["augmented", "eleventh"] },

  // 12ths
  P12_up: { id: "P12_up", tokenIds: ["perfect", "twelfth"] },
  P12_down: { id: "P12_down", tokenIds: ["perfect", "twelfth"] },
  P12_harmonic: { id: "P12_harmonic", tokenIds: ["perfect", "twelfth"] },

  Aug12_up: { id: "Aug12_up", tokenIds: ["augmented", "twelfth"] },
  Aug12_down: { id: "Aug12_down", tokenIds: ["augmented", "twelfth"] },
  Aug12_harmonic: { id: "Aug12_harmonic", tokenIds: ["augmented", "twelfth"] },

  // 13ths
  P13_up: { id: "P13_up", tokenIds: ["perfect", "thirteenth"] },
  P13_down: { id: "P13_down", tokenIds: ["perfect", "thirteenth"] },
  P13_harmonic: { id: "P13_harmonic", tokenIds: ["perfect", "thirteenth"] },

  Aug13_up: { id: "Aug13_up", tokenIds: ["augmented", "thirteenth"] },
  Aug13_down: { id: "Aug13_down", tokenIds: ["augmented", "thirteenth"] },
  Aug13_harmonic: { id: "Aug13_harmonic", tokenIds: ["augmented", "thirteenth"] },

  /* ---------- CHORDS ---------- */

  // ===== Triads & basic =====
  maj: { id: "maj", tokenIds: ["major"] },
  min: { id: "min", tokenIds: ["minor"] },
  aug: { id: "aug", tokenIds: ["augmented"] },
  dim: { id: "dim", tokenIds: ["diminished"] },
  power: { id: "power", tokenIds: ["power"] },
  sus2: { id: "sus2", tokenIds: ["suspended", "second"] },
  sus4: { id: "sus4", tokenIds: ["suspended", "fourth"] },

  // ===== Dominant =====
  dom7: { id: "dom7", tokenIds: ["dominant", "seventh"] },
  dom7b5: { id: "dom7b5", tokenIds: ["dominant", "seventh", "flat5"] },
  "dom7#5": { id: "dom7#5", tokenIds: ["dominant", "seventh", "sharp5"] },
  dom7b9: { id: "dom7b9", tokenIds: ["dominant", "seventh", "flat9"] },
  "dom7#9": { id: "dom7#9", tokenIds: ["dominant", "seventh", "sharp9"] },
  dom7sus4: { id: "dom7sus4", tokenIds: ["dominant", "seventh", "suspended", "fourth"] },
  dom9: { id: "dom9", tokenIds: ["dominant", "ninth"] },
  dom11: { id: "dom11", tokenIds: ["dominant", "eleventh"] },
  dom13: { id: "dom13", tokenIds: ["dominant", "thirteenth"] },

  // ===== Minor =====
  m7: { id: "m7", tokenIds: ["minor", "seventh"] },
  m7b5: { id: "m7b5", tokenIds: ["minor", "seventh", "flat5"] },
  m9: { id: "m9", tokenIds: ["minor", "ninth"] },
  m11: { id: "m11", tokenIds: ["minor", "eleventh"] },
  m13: { id: "m13", tokenIds: ["minor", "thirteenth"] },
  m6_9: { id: "m6_9", tokenIds: ["minor", "sixth", "ninth"] },
  mMaj7: { id: "mMaj7", tokenIds: ["minor", "major", "seventh"] },
  mMaj9: { id: "mMaj9", tokenIds: ["minor", "major", "ninth"] },

  // ===== Major =====
  maj7: { id: "maj7", tokenIds: ["major", "seventh"] },
  "maj7#5": { id: "maj7#5", tokenIds: ["major", "seventh", "sharp5"] },
  maj9: { id: "maj9", tokenIds: ["major", "ninth"] },
  "maj9#11": { id: "maj9#11", tokenIds: ["major", "ninth", "sharp11"] },
  maj11: { id: "maj11", tokenIds: ["major", "eleventh"] },
  maj13: { id: "maj13", tokenIds: ["major", "thirteenth"] },
  "maj13#11": { id: "maj13#11", tokenIds: ["major", "thirteenth", "sharp11"] },
  maj6_9: { id: "maj6_9", tokenIds: ["major", "sixth", "ninth"] },

  // ===== Added-tone =====
  majadd4: { id: "majadd4", tokenIds: ["major", "add4"] },
  majadd6: { id: "majadd6", tokenIds: ["major", "add6"] },
  majadd9: { id: "majadd9", tokenIds: ["major", "add9"] },
  minadd4: { id: "minadd4", tokenIds: ["minor", "add4"] },
  minadd6: { id: "minadd6", tokenIds: ["minor", "add6"] },
  minadd9: { id: "minadd9", tokenIds: ["minor", "add9"] },

  // ===== Fully diminished =====
  dim7: { id: "dim7", tokenIds: ["diminished", "seventh"] },

  // ===== Dominant 13th variations =====
  dom13b9: { id: "dom13b9", tokenIds: ["dominant", "thirteenth", "flat9"] },
  "dom13#9": { id: "dom13#9", tokenIds: ["dominant", "thirteenth", "sharp9"] },
  "dom13#11": { id: "dom13#11", tokenIds: ["dominant", "thirteenth", "sharp11"] },
  dom13b5: { id: "dom13b5", tokenIds: ["dominant", "thirteenth", "flat5"] },
  "dom13#5": { id: "dom13#5", tokenIds: ["dominant", "thirteenth", "sharp5"] },
  "dom7#13": { id: "dom7#13", tokenIds: ["dominant", "seventh", "sharp13"] },

  /* ---------- NOTES ---------- */

  note_C: { id: "note_C", tokenIds: ["C"] },
  "note_C#": { id: "note_C#", tokenIds: ["C#"] },
  note_D: { id: "note_D", tokenIds: ["D"] },
  "note_D#": { id: "note_D#", tokenIds: ["D#"] },
  note_E: { id: "note_E", tokenIds: ["E"] },
  note_F: { id: "note_F", tokenIds: ["F"] },
  "note_F#": { id: "note_F#", tokenIds: ["F#"] },
  note_G: { id: "note_G", tokenIds: ["G"] },
  "note_G#": { id: "note_G#", tokenIds: ["G#"] },
  note_A: { id: "note_A", tokenIds: ["A"] },
  "note_A#": { id: "note_A#", tokenIds: ["A#"] },
  note_B: { id: "note_B", tokenIds: ["B"] },
} as const satisfies Record<string, SkillComponent>


export type SkillComponentId = keyof typeof SKILL_COMPONENTS


export const SKILL_NODES = {
  //----------- ASCENDING INTERVALS ------------
  asc_2nds: {
    id: "asc_2nds",
    title: "Ascending 2nds",
    skillComponentIds: ["m2_up", "Maj2_up"],
    skillMode: "ascending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  asc_3rds: {
    id: "asc_3rds",
    title: "Ascending 3rds",
    skillComponentIds: ["m3_up", "Maj3_up"],
    skillMode: "ascending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  asc_4ths: {
    id: "asc_4ths",
    title: "Ascending 4ths",
    skillComponentIds: ["P4_up"],
    skillMode: "ascending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  asc_5ths: {
    id: "asc_5ths",
    title: "Ascending 5ths",
    skillComponentIds: ["P5_up", "Dim5_up"],
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
    skillComponentIds: ["m6_up", "Maj6_up"],
    skillMode: "ascending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  asc_7ths: {
    id: "asc_7ths",
    title: "Ascending 7ths",
    skillComponentIds: ["m7_up", "Maj7_up"],
    skillMode: "ascending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  asc_9ths: {
    id: "asc_9ths",
    title: "Ascending 9ths",
    skillComponentIds: ["m9_up", "Maj9_up"],
    skillMode: "ascending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  asc_10_11: {
    id: "asc_10_11",
    title: "Ascending 10ths & 11ths",
    skillComponentIds: ["m10_up", "Maj10_up", "P11_up", "Aug11_up"],
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
    skillComponentIds: ["m2_down", "Maj2_down"],
    skillMode: "descending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  desc_3rds: {
    id: "desc_3rds",
    title: "Descending 3rds",
    skillComponentIds: ["m3_down", "Maj3_down"],
    skillMode: "descending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  desc_4ths: {
    id: "desc_4ths",
    title: "Descending 4ths",
    skillComponentIds: ["P4_down"],
    skillMode: "descending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  desc_5ths: {
    id: "desc_5ths",
    title: "Descending 5ths",
    skillComponentIds: ["P5_down", "Dim5_down"],
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
    skillComponentIds: ["m6_down", "Maj6_down"],
    skillMode: "descending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  desc_7ths: {
    id: "desc_7ths",
    title: "Descending 7ths",
    skillComponentIds: ["m7_down", "Maj7_down"],
    skillMode: "descending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  desc_9ths: {
    id: "desc_9ths",
    title: "Descending 9ths",
    skillComponentIds: ["m9_down", "Maj9_down"],
    skillMode: "descending_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  desc_10_11: {
    id: "desc_10_11",
    title: "Descending 10ths & 11ths",
    skillComponentIds: ["m10_down", "Maj10_down", "P11_down", "Aug11_down"],
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
    skillComponentIds: ["m2_harmonic", "Maj2_harmonic"],
    skillMode: "harmonic_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  harmonic_3rds: {
    id: "harmonic_3rds",
    title: "Harmonic 3rds",
    skillComponentIds: ["m3_harmonic", "Maj3_harmonic"],
    skillMode: "harmonic_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  harmonic_4ths: {
    id: "harmonic_4ths",
    title: "Harmonic 4ths",
    skillComponentIds: ["P4_harmonic"],
    skillMode: "harmonic_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  harmonic_5ths: {
    id: "harmonic_5ths",
    title: "Harmonic 5ths",
    skillComponentIds: ["P5_harmonic", "Dim5_harmonic"],
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
    skillComponentIds: ["m6_harmonic", "Maj6_harmonic"],
    skillMode: "harmonic_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  harmonic_7ths: {
    id: "harmonic_7ths",
    title: "Harmonic 7ths",
    skillComponentIds: ["m7_harmonic", "Maj7_harmonic"],
    skillMode: "harmonic_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  harmonic_9ths: {
    id: "harmonic_9ths",
    title: "Harmonic 9ths",
    skillComponentIds: ["m9_harmonic", "Maj9_harmonic"],
    skillMode: "harmonic_intervals",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  harmonic_10_11: {
    id: "harmonic_10_11",
    title: "Harmonic 10ths & 11ths",
    skillComponentIds: ["m10_harmonic", "Maj10_harmonic", "P11_harmonic", "Aug11_harmonic"],
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
    skillComponentIds: ["note_C#", "note_D#"],
    skillMode: "notes",
    nodeType: "LISTENING",
    displayMode: "DEFAULT",
  },
  notes_black_2: {
    id: "notes_black_2",
    title: "Black Notes (Group 2)",
    skillComponentIds: ["note_F#", "note_G#", "note_A#"],
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

export const LEVELS_FROM_XP: Record<number, number> = {
  1: 0,
  2: 100,
  3: 300,
  4: 600,
  5: 1000,
  6: 1500
}

