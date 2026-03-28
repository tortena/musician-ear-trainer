import type { SkillComponent } from "@/domain/skillModel/SkillComponent"
import type { SkillNode } from "@/domain/skillModel/SkillNode"

type TheoryVisualKind = "PIANO" | "STAFF"
type TheoryNodeConfig = {
  id: string
  title: string
  skillMode: string
  sourceComponentIds: string[]
  visualKind: TheoryVisualKind
  clef?: "treble" | "bass"
}

function makeTheoryComponentId(sourceComponentId: string, visualKind: TheoryVisualKind) {
  return `${sourceComponentId}__${visualKind.toLowerCase()}`
}

const THEORY_NODE_CONFIGS: TheoryNodeConfig[] = [
  {
    id: "notes_white_1_piano",
    title: "White Notes (C-E) Piano",
    skillMode: "notes",
    sourceComponentIds: ["note_C", "note_D", "note_E"],
    visualKind: "PIANO",
  },
  {
    id: "notes_white_1_staff",
    title: "White Notes (C-E) Staff",
    skillMode: "notes",
    sourceComponentIds: ["note_C", "note_D", "note_E"],
    visualKind: "STAFF",
    clef: "treble",
  },
  {
    id: "notes_white_2_piano",
    title: "White Notes (F-B) Piano",
    skillMode: "notes",
    sourceComponentIds: ["note_F", "note_G", "note_A", "note_B"],
    visualKind: "PIANO",
  },
  {
    id: "notes_white_2_staff",
    title: "White Notes (F-B) Staff",
    skillMode: "notes",
    sourceComponentIds: ["note_F", "note_G", "note_A", "note_B"],
    visualKind: "STAFF",
    clef: "bass",
  },
  {
    id: "notes_black_1_piano",
    title: "Black Notes (C#/D#) Piano",
    skillMode: "notes",
    sourceComponentIds: ["note_C#", "note_D#"],
    visualKind: "PIANO",
  },
  {
    id: "notes_black_1_staff",
    title: "Black Notes (C#/D#) Staff",
    skillMode: "notes",
    sourceComponentIds: ["note_C#", "note_D#"],
    visualKind: "STAFF",
    clef: "treble",
  },
  {
    id: "notes_black_2_piano",
    title: "Black Notes (F#/G#/A#) Piano",
    skillMode: "notes",
    sourceComponentIds: ["note_F#", "note_G#", "note_A#"],
    visualKind: "PIANO",
  },
  {
    id: "notes_black_2_staff",
    title: "Black Notes (F#/G#/A#) Staff",
    skillMode: "notes",
    sourceComponentIds: ["note_F#", "note_G#", "note_A#"],
    visualKind: "STAFF",
    clef: "bass",
  },
  {
    id: "asc_2nds_piano",
    title: "Ascending 2nds Piano",
    skillMode: "ascending_intervals",
    sourceComponentIds: ["m2_up", "Maj2_up"],
    visualKind: "PIANO",
  },
  {
    id: "asc_2nds_staff",
    title: "Ascending 2nds Staff",
    skillMode: "ascending_intervals",
    sourceComponentIds: ["m2_up", "Maj2_up"],
    visualKind: "STAFF",
    clef: "treble",
  },
  {
    id: "asc_3rds_piano",
    title: "Ascending 3rds Piano",
    skillMode: "ascending_intervals",
    sourceComponentIds: ["m3_up", "Maj3_up"],
    visualKind: "PIANO",
  },
  {
    id: "asc_3rds_staff",
    title: "Ascending 3rds Staff",
    skillMode: "ascending_intervals",
    sourceComponentIds: ["m3_up", "Maj3_up"],
    visualKind: "STAFF",
    clef: "treble",
  },
  {
    id: "asc_4ths_piano",
    title: "Ascending 4ths Piano",
    skillMode: "ascending_intervals",
    sourceComponentIds: ["P4_up"],
    visualKind: "PIANO",
  },
  {
    id: "asc_4ths_staff",
    title: "Ascending 4ths Staff",
    skillMode: "ascending_intervals",
    sourceComponentIds: ["P4_up"],
    visualKind: "STAFF",
    clef: "treble",
  },
  {
    id: "asc_5ths_piano",
    title: "Ascending 5ths Piano",
    skillMode: "ascending_intervals",
    sourceComponentIds: ["P5_up", "Dim5_up"],
    visualKind: "PIANO",
  },
  {
    id: "asc_5ths_staff",
    title: "Ascending 5ths Staff",
    skillMode: "ascending_intervals",
    sourceComponentIds: ["P5_up", "Dim5_up"],
    visualKind: "STAFF",
    clef: "treble",
  },
  {
    id: "desc_2nds_piano",
    title: "Descending 2nds Piano",
    skillMode: "descending_intervals",
    sourceComponentIds: ["m2_down", "Maj2_down"],
    visualKind: "PIANO",
  },
  {
    id: "desc_2nds_staff",
    title: "Descending 2nds Staff",
    skillMode: "descending_intervals",
    sourceComponentIds: ["m2_down", "Maj2_down"],
    visualKind: "STAFF",
    clef: "bass",
  },
  {
    id: "desc_3rds_piano",
    title: "Descending 3rds Piano",
    skillMode: "descending_intervals",
    sourceComponentIds: ["m3_down", "Maj3_down"],
    visualKind: "PIANO",
  },
  {
    id: "desc_3rds_staff",
    title: "Descending 3rds Staff",
    skillMode: "descending_intervals",
    sourceComponentIds: ["m3_down", "Maj3_down"],
    visualKind: "STAFF",
    clef: "bass",
  },
  {
    id: "desc_4ths_piano",
    title: "Descending 4ths Piano",
    skillMode: "descending_intervals",
    sourceComponentIds: ["P4_down"],
    visualKind: "PIANO",
  },
  {
    id: "desc_4ths_staff",
    title: "Descending 4ths Staff",
    skillMode: "descending_intervals",
    sourceComponentIds: ["P4_down"],
    visualKind: "STAFF",
    clef: "bass",
  },
  {
    id: "desc_5ths_piano",
    title: "Descending 5ths Piano",
    skillMode: "descending_intervals",
    sourceComponentIds: ["P5_down", "Dim5_down"],
    visualKind: "PIANO",
  },
  {
    id: "desc_5ths_staff",
    title: "Descending 5ths Staff",
    skillMode: "descending_intervals",
    sourceComponentIds: ["P5_down", "Dim5_down"],
    visualKind: "STAFF",
    clef: "bass",
  },
  {
    id: "harmonic_2nds_piano",
    title: "Harmonic 2nds Piano",
    skillMode: "harmonic_intervals",
    sourceComponentIds: ["m2_harmonic", "Maj2_harmonic"],
    visualKind: "PIANO",
  },
  {
    id: "harmonic_2nds_staff",
    title: "Harmonic 2nds Staff",
    skillMode: "harmonic_intervals",
    sourceComponentIds: ["m2_harmonic", "Maj2_harmonic"],
    visualKind: "STAFF",
    clef: "treble",
  },
  {
    id: "harmonic_3rds_piano",
    title: "Harmonic 3rds Piano",
    skillMode: "harmonic_intervals",
    sourceComponentIds: ["m3_harmonic", "Maj3_harmonic"],
    visualKind: "PIANO",
  },
  {
    id: "harmonic_3rds_staff",
    title: "Harmonic 3rds Staff",
    skillMode: "harmonic_intervals",
    sourceComponentIds: ["m3_harmonic", "Maj3_harmonic"],
    visualKind: "STAFF",
    clef: "treble",
  },
  {
    id: "harmonic_4ths_piano",
    title: "Harmonic 4ths Piano",
    skillMode: "harmonic_intervals",
    sourceComponentIds: ["P4_harmonic"],
    visualKind: "PIANO",
  },
  {
    id: "harmonic_4ths_staff",
    title: "Harmonic 4ths Staff",
    skillMode: "harmonic_intervals",
    sourceComponentIds: ["P4_harmonic"],
    visualKind: "STAFF",
    clef: "treble",
  },
  {
    id: "harmonic_5ths_piano",
    title: "Harmonic 5ths Piano",
    skillMode: "harmonic_intervals",
    sourceComponentIds: ["P5_harmonic", "Dim5_harmonic"],
    visualKind: "PIANO",
  },
  {
    id: "harmonic_5ths_staff",
    title: "Harmonic 5ths Staff",
    skillMode: "harmonic_intervals",
    sourceComponentIds: ["P5_harmonic", "Dim5_harmonic"],
    visualKind: "STAFF",
    clef: "treble",
  },
  {
    id: "chord_triads_piano",
    title: "Basic Triads Piano",
    skillMode: "chords",
    sourceComponentIds: ["maj", "min", "dim", "aug"],
    visualKind: "PIANO",
  },
  {
    id: "chord_triads_staff",
    title: "Basic Triads Staff",
    skillMode: "chords",
    sourceComponentIds: ["maj", "min", "dim", "aug"],
    visualKind: "STAFF",
    clef: "bass",
  },
  {
    id: "chord_sus_power_piano",
    title: "Suspended & Power Piano",
    skillMode: "chords",
    sourceComponentIds: ["sus2", "sus4", "power"],
    visualKind: "PIANO",
  },
  {
    id: "chord_sus_power_staff",
    title: "Suspended & Power Staff",
    skillMode: "chords",
    sourceComponentIds: ["sus2", "sus4", "power"],
    visualKind: "STAFF",
    clef: "bass",
  },
  {
    id: "chord_major_minor_7_piano",
    title: "Major & Minor 7ths Piano",
    skillMode: "chords",
    sourceComponentIds: ["maj7", "m7", "mMaj7"],
    visualKind: "PIANO",
  },
  {
    id: "chord_major_minor_7_staff",
    title: "Major & Minor 7ths Staff",
    skillMode: "chords",
    sourceComponentIds: ["maj7", "m7", "mMaj7"],
    visualKind: "STAFF",
    clef: "bass",
  },
  {
    id: "chord_dom_dim_7_piano",
    title: "Dominant & Diminished 7ths Piano",
    skillMode: "chords",
    sourceComponentIds: ["dom7", "m7b5", "dim7"],
    visualKind: "PIANO",
  },
  {
    id: "chord_dom_dim_7_staff",
    title: "Dominant & Diminished 7ths Staff",
    skillMode: "chords",
    sourceComponentIds: ["dom7", "m7b5", "dim7"],
    visualKind: "STAFF",
    clef: "bass",
  },
]

export function buildTheoryComponents(baseComponents: Record<string, SkillComponent>) {
  const components: Record<string, SkillComponent> = {}

  for (const config of THEORY_NODE_CONFIGS) {
    for (const sourceComponentId of config.sourceComponentIds) {
      const sourceComponent = baseComponents[sourceComponentId]
      if (!sourceComponent) continue

      const componentId = makeTheoryComponentId(sourceComponentId, config.visualKind)
      if (componentId in components) continue

      components[componentId] = {
        id: componentId,
        tokenIds: [...sourceComponent.tokenIds],
        prompt:
          config.visualKind === "PIANO"
            ? { kind: "PIANO", sourceComponentId }
            : { kind: "STAFF", sourceComponentId, clef: config.clef ?? "treble" },
      }
    }
  }

  return components
}

export function buildTheoryNodes() {
  const nodes: Record<string, SkillNode> = {}

  for (const config of THEORY_NODE_CONFIGS) {
    nodes[config.id] = {
      id: config.id,
      title: config.title,
      skillMode: config.skillMode,
      nodeType: "THEORY",
      displayMode: "DEFAULT",
      skillComponentIds: config.sourceComponentIds.map((sourceComponentId) =>
        makeTheoryComponentId(sourceComponentId, config.visualKind)
      ),
    }
  }

  return nodes
}

export const THEORY_STAGE_NODE_IDS = {
  notes: {
    0: ["notes_white_1_piano", "notes_white_1_staff"],
    1: ["notes_white_2_piano", "notes_white_2_staff"],
    2: ["notes_black_1_piano", "notes_black_1_staff"],
    3: ["notes_black_2_piano", "notes_black_2_staff"],
  },
  ascending_intervals: {
    0: ["asc_2nds_piano", "asc_2nds_staff", "asc_3rds_piano", "asc_3rds_staff"],
    1: ["asc_4ths_piano", "asc_4ths_staff", "asc_5ths_piano", "asc_5ths_staff"],
  },
  descending_intervals: {
    0: ["desc_2nds_piano", "desc_2nds_staff", "desc_3rds_piano", "desc_3rds_staff"],
    1: ["desc_4ths_piano", "desc_4ths_staff", "desc_5ths_piano", "desc_5ths_staff"],
  },
  harmonic_intervals: {
    0: ["harmonic_2nds_piano", "harmonic_2nds_staff", "harmonic_3rds_piano", "harmonic_3rds_staff"],
    1: ["harmonic_4ths_piano", "harmonic_4ths_staff", "harmonic_5ths_piano", "harmonic_5ths_staff"],
  },
  chords: {
    0: ["chord_triads_piano", "chord_triads_staff", "chord_sus_power_piano", "chord_sus_power_staff"],
    1: ["chord_major_minor_7_piano", "chord_major_minor_7_staff"],
    2: ["chord_dom_dim_7_piano", "chord_dom_dim_7_staff"],
  },
} as const
