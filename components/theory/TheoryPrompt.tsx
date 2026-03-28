import { SKILL_COMPONENTS, SkillComponentId } from "@/constants"
import { TokenId } from "@/domain/skillModel/Token"
import { useAppTheme } from "@/theme/ThemeProvider"
import { StyleSheet, View } from "react-native"
import Svg, { Ellipse, Line, Rect, Text as SvgText } from "react-native-svg"

type Pitch = {
  midi: number
  name: string
  letter: string
  accidental?: "#" | "b"
  octave: number
}

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const
const SHARP_PITCHES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const INTERVAL_BASE_SEMITONES: Record<string, number> = {
  second: 2,
  third: 4,
  fourth: 5,
  fifth: 7,
  sixth: 9,
  seventh: 11,
  octave: 12,
  ninth: 14,
  tenth: 16,
  eleventh: 17,
  twelfth: 19,
  thirteenth: 21,
}

function midiToPitch(midi: number): Pitch {
  const pitchClass = ((midi % 12) + 12) % 12
  const name = SHARP_PITCHES[pitchClass]
  return {
    midi,
    name,
    letter: name[0],
    accidental: name.includes("#") ? "#" : undefined,
    octave: Math.floor(midi / 12) - 1,
  }
}

function semitonesForInterval(tokens: TokenId[]) {
  const degreeToken = tokens.find((token) => token in INTERVAL_BASE_SEMITONES)
  if (!degreeToken) return 0

  const base = INTERVAL_BASE_SEMITONES[degreeToken]
  if (tokens.includes("minor")) return base - 1
  if (tokens.includes("augmented")) return base + 1
  if (tokens.includes("diminished")) return base - 1
  return base
}

function chordSemitones(tokens: TokenId[]) {
  let notes = [0]

  if (tokens.includes("power")) {
    notes = [0, 7]
  } else if (tokens.includes("suspended") && tokens.includes("second")) {
    notes = [0, 2, 7]
  } else if (tokens.includes("suspended") && tokens.includes("fourth")) {
    notes = [0, 5, 7]
  } else if (tokens.includes("diminished")) {
    notes = [0, 3, 6]
  } else if (tokens.includes("augmented")) {
    notes = [0, 4, 8]
  } else if (tokens.includes("minor")) {
    notes = [0, 3, 7]
  } else {
    notes = [0, 4, 7]
  }

  if (tokens.includes("seventh")) {
    if (tokens.includes("diminished")) notes.push(9)
    else if (tokens.includes("major") && !tokens.includes("dominant")) notes.push(11)
    else if (tokens.includes("minor") && tokens.includes("major")) notes.push(11)
    else notes.push(10)
  }

  if (tokens.includes("sixth")) notes.push(9)
  if (tokens.includes("ninth")) notes.push(14)
  if (tokens.includes("eleventh")) notes.push(17)
  if (tokens.includes("thirteenth")) notes.push(21)
  if (tokens.includes("add4")) notes.push(5)
  if (tokens.includes("add6")) notes.push(9)
  if (tokens.includes("add9")) notes.push(14)

  if (tokens.includes("sharp5")) notes = notes.filter((n) => n !== 7).concat(8)
  if (tokens.includes("flat5")) notes = notes.filter((n) => n !== 7).concat(6)
  if (tokens.includes("flat9")) notes = notes.filter((n) => n !== 14).concat(13)
  if (tokens.includes("sharp9")) notes = notes.filter((n) => n !== 14).concat(15)
  if (tokens.includes("sharp11")) notes = notes.filter((n) => n !== 17).concat(18)
  if (tokens.includes("flat13")) notes = notes.filter((n) => n !== 21).concat(20)
  if (tokens.includes("sharp13")) notes = notes.filter((n) => n !== 21).concat(22)

  return [...new Set(notes)].sort((a, b) => a - b)
}

function buildPitches(sourceComponentId: string, clef: "treble" | "bass"): Pitch[] {
  const component = SKILL_COMPONENTS[sourceComponentId as SkillComponentId]
  if (!component) return []

  if (sourceComponentId.startsWith("note_")) {
    const pitchName = sourceComponentId.slice(5)
    const baseMidi =
      clef === "bass"
        ? ({
            C: 48, "C#": 49, D: 50, "D#": 51, E: 52, F: 53, "F#": 54, G: 55, "G#": 56, A: 57, "A#": 58, B: 59,
          }[pitchName] ?? 48)
        : ({
            C: 60, "C#": 61, D: 62, "D#": 63, E: 64, F: 65, "F#": 66, G: 67, "G#": 68, A: 69, "A#": 70, B: 71,
          }[pitchName] ?? 60)
    return [midiToPitch(baseMidi)]
  }

  if (sourceComponentId.includes("_")) {
    const semitones = semitonesForInterval(component.tokenIds)
    const rootMidi = clef === "bass" ? 48 : 60

    if (sourceComponentId.includes("_down")) {
      return [midiToPitch(rootMidi + semitones), midiToPitch(rootMidi)]
    }

    return [midiToPitch(rootMidi), midiToPitch(rootMidi + semitones)]
  }

  const rootMidi = clef === "bass" ? 48 : 60
  return chordSemitones(component.tokenIds).map((interval) => midiToPitch(rootMidi + interval))
}

function diatonicIndex(pitch: Pitch) {
  return pitch.octave * 7 + LETTERS.indexOf(pitch.letter as (typeof LETTERS)[number])
}

function staffYForPitch(pitch: Pitch, clef: "treble" | "bass") {
  const referencePitch = clef === "treble" ? { letter: "E", octave: 4 } : { letter: "G", octave: 2 }
  const referenceIndex = referencePitch.octave * 7 + LETTERS.indexOf(referencePitch.letter as (typeof LETTERS)[number])
  const step = diatonicIndex(pitch) - referenceIndex
  const bottomLineY = 148
  return bottomLineY - step * 8
}

function getLedgerLineYs(y: number) {
  const topLineY = 84
  const bottomLineY = 148
  const ledgerLines: number[] = []

  if (y < topLineY) {
    for (let ledgerY = topLineY - 16; ledgerY >= y; ledgerY -= 16) {
      ledgerLines.push(ledgerY)
    }
  }

  if (y > bottomLineY) {
    for (let ledgerY = bottomLineY + 16; ledgerY <= y; ledgerY += 16) {
      ledgerLines.push(ledgerY)
    }
  }

  return ledgerLines
}

function PianoPrompt({ pitches }: { pitches: Pitch[] }) {
  const { theme } = useAppTheme()
  const whiteKeys = [
    "C4", "D4", "E4", "F4", "G4", "A4", "B4",
    "C5", "D5", "E5", "F5", "G5", "A5", "B5",
  ]
  const blackKeys = [
    { key: "C#4", index: 0 }, { key: "D#4", index: 1 }, { key: "F#4", index: 3 }, { key: "G#4", index: 4 }, { key: "A#4", index: 5 },
    { key: "C#5", index: 7 }, { key: "D#5", index: 8 }, { key: "F#5", index: 10 }, { key: "G#5", index: 11 }, { key: "A#5", index: 12 },
  ]
  const highlighted = new Set(pitches.map((pitch) => `${pitch.name}${pitch.octave}`))

  return (
    <View style={[styles.promptFrame, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
      <Svg width="100%" height="180" viewBox="0 0 320 180">
        <Rect x="0" y="0" width="320" height="180" rx="24" fill={theme.mode === "dark" ? "#162116" : "#F7FBF3"} />
        {whiteKeys.map((key, index) => (
          <Rect
            key={key}
            x={14 + index * 21}
            y={36}
            width={20}
            height={118}
            rx={4}
            fill={highlighted.has(key) ? theme.success : "#FFFFFF"}
            stroke={theme.cardBorder}
          />
        ))}
        {blackKeys.map(({ key, index }) => (
          <Rect
            key={key}
            x={29 + index * 21}
            y={36}
            width={14}
            height={72}
            rx={4}
            fill={highlighted.has(key) ? theme.accent : theme.mode === "dark" ? "#1A1715" : "#2E2925"}
          />
        ))}
      </Svg>
    </View>
  )
}

function StaffPrompt({ pitches, clef, harmonic }: { pitches: Pitch[]; clef: "treble" | "bass"; harmonic: boolean }) {
  const { theme } = useAppTheme()
  const noteXs = harmonic ? pitches.map(() => 190) : pitches.map((_, index) => 170 + index * 54)

  return (
    <View style={[styles.promptFrame, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
      <Svg width="100%" height="180" viewBox="0 0 320 180">
        <Rect x="0" y="0" width="320" height="180" rx="24" fill={theme.mode === "dark" ? "#1B1815" : "#FFFCF7"} />
        {[0, 1, 2, 3, 4].map((line) => (
          <Line
            key={line}
            x1="40"
            x2="286"
            y1={84 + line * 16}
            y2={84 + line * 16}
            stroke={theme.textSoft}
            strokeOpacity="0.55"
            strokeWidth="1.5"
          />
        ))}
        <SvgText
          x={clef === "treble" ? "52" : "62"}
          y={clef === "treble" ? "142" : "136"}
          fontSize={clef === "treble" ? "70" : "58"}
          fill={theme.text}
        >
          {clef === "treble" ? "𝄞" : "𝄢"}
        </SvgText>
        {pitches.map((pitch, index) => {
          const y = staffYForPitch(pitch, clef)
          const ledgerLineYs = getLedgerLineYs(y)
          return (
            <>
              {ledgerLineYs.map((ledgerY) => (
                <Line
                  key={`${pitch.name}-${index}-ledger-${ledgerY}`}
                  x1={noteXs[index] - 16}
                  x2={noteXs[index] + 16}
                  y1={ledgerY}
                  y2={ledgerY}
                  stroke={theme.textSoft}
                  strokeOpacity="0.7"
                  strokeWidth="1.5"
                />
              ))}
              {pitch.accidental && (
                <SvgText
                  key={`${pitch.name}-${index}-accidental`}
                  x={noteXs[index] - 34}
                  y={y + 8}
                  fontSize="28"
                  fill={theme.text}
                >
                  {pitch.accidental}
                </SvgText>
              )}
              <Ellipse
                key={`${pitch.name}-${index}`}
                cx={noteXs[index]}
                cy={y}
                rx="11"
                ry="8"
                fill={theme.text}
                transform={`rotate(-22 ${noteXs[index]} ${y})`}
              />
              <Line
                x1={noteXs[index] + 9}
                x2={noteXs[index] + 9}
                y1={y}
                y2={y - 52}
                stroke={theme.text}
                strokeWidth="2"
              />
            </>
          )
        })}
      </Svg>
    </View>
  )
}

export function TheoryPrompt({ skillComponentId }: { skillComponentId: SkillComponentId }) {
  const prompt = SKILL_COMPONENTS[skillComponentId]?.prompt

  if (!prompt || prompt.kind === "AUDIO") {
    return null
  }

  const pitches = buildPitches(prompt.sourceComponentId, prompt.kind === "STAFF" ? prompt.clef : "treble")

  if (prompt.kind === "PIANO") {
    return <PianoPrompt pitches={pitches} />
  }

  return (
    <StaffPrompt
      pitches={pitches}
      clef={prompt.clef}
      harmonic={prompt.sourceComponentId.includes("_harmonic") || !prompt.sourceComponentId.includes("_")}
    />
  )
}

const styles = StyleSheet.create({
  promptFrame: {
    borderWidth: 1,
    borderRadius: 28,
    overflow: "hidden",
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",
  },
})
