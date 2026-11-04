import type { ScoreRow, Scores } from './types'

/** Highest score first. { a: 0.1, b: 0.7 } -> [{ label: 'b', value: 0.7 }, { label: 'a', value: 0.1 }] */
export function sortByConfidence(scores: Scores): ScoreRow[] {
  return Object.entries(scores).map(([label, value]) => ({ label, value }))
  .sort((a, b) => b.value - a.value)
}

/** 0.2525825 -> "25.26%" (two decimal places, as the spec asks). */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

/** The label with the highest score: what the A.I. "picked". Empty string when there are no scores. */
export function topLabel(scores: Scores): string {
  const sorted = sortByConfidence(scores)
  const first = sorted[0]
  return first?.label ?? ''
}
