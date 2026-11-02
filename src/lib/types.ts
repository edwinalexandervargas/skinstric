/** The three things the A.I. estimates, in the order the demographics page shows them. */
export const CATEGORIES = ['race', 'age', 'gender'] as const
export type Category = (typeof CATEGORIES)[number]

/** One category's scores from the API, e.g. { "east asian": 0.25, "white": 0.13, ... }. */
export type Scores = Record<string, number>

/** The `data` object the Phase 2 API sends back. */
export type Demographics = Record<Category, Scores>

/** One row of the list on the demographics page. */
export interface ScoreRow {
  label: string
  value: number
}
